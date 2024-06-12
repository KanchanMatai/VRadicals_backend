const express = require('express');
const router = express.Router();
const User = require('../models/Hr');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee'); // Import the Employee model
const authMiddleware = require('../middleware/authMiddleware');
// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, age, email, mobile, address, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = new User({
            name,
            age,
            email,
            mobile,
            address,
            password,
            role,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const expiresInSeconds = 8 * 24 * 60 * 60; // 8 days in seconds
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: expiresInSeconds  });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Hr can add the employees


router.post('/add-employee', async (req, res) => {
    try {
        const { name, age, email, mobile, address } = req.body;

        // Extract the JWT token from the request headers
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'your_jwt_secret');
        const userRole = decodedToken.role;

        // Check if the user is HR
        if (userRole !== 'hr') {
            return res.status(403).json({ message: 'Only HR can add employees' });
        }

        const employee = new Employee({
            name,
            age,
            email,
            mobile,
            address,
        });

        await employee.save();
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin can appove the employees

router.put('/approve-employee/:employeeId', authMiddleware, async (req, res) => {
    try {
        console.log("Request Params:", req.params);
        const { employeeId } = req.params;

        // Check if the user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can approve employees' });
        }
        console.log("Employee ID:", employeeId);
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update the approved field
        employee.approved = true;
        await employee.save();

        res.status(200).json({ message: 'Employee approved successfully' });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
