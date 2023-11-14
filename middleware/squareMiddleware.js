// middleware/squareMiddleware.js
const axios = require('axios');
const dotenv = require('dotenv');

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;

const squareMiddleware = async (req, res, next) => {
  try {
    if (!squareAccessToken) {
      throw new Error('Square access token not provided');
    }
    req.squareAxios = axios.create({
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`
      }
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = squareMiddleware;
