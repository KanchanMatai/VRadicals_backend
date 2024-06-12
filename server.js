// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const hrRoutes = require('./routes/hrRoutes');
// require('dotenv').config(); 
// const app = express();
// var cors = require('cors')
// // Middleware
// app.use(bodyParser.json());

// // Database connection
// mongoose.connect('mongodb://localhost:27017/yourdbname', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });

// // Routes
// app.use('/api/hr', hrRoutes);
// app.use(cors())
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hrRoutes');
require('dotenv').config(); 
const cors = require('cors'); // Import CORS middleware

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware

// Database connection
mongoose.connect('mongodb://localhost:27017/yourdbname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/hr', hrRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
