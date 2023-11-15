const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Import routes
const locationsRoutes = require('./routes/location');

// Use routes
app.use('/locations', locationsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
