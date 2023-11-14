const  axios =  require('axios');
const dotenv = require('dotenv');
const SqureBaseURL = process.env.SqureBaseURL;
const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;


exports.SqurebaseURL = axios.create({
baseURL : SqureBaseURL,
headers: {
  'Authorization': `Bearer ${squareAccessToken}`
}
 });

