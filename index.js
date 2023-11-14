// app.js
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const locationsRoutes = require('./routes/location');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;



// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes
app.use('/locations', locationsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
