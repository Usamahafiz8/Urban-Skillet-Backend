const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Location API',
      version: '1.0.0',
      description: 'API for managing locations',
    },
  },
  apis: ['./routes/*.js'], // Adjust the path accordingly
};

const specs = swaggerJsdoc(options);

module.exports = specs;
