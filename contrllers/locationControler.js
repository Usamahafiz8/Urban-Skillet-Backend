const axios = require('axios');
const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;

const listLocations = async (req, res) => {
  try {
    const response = await axios.get('https://connect.squareupsandbox.com/v2/locations', {
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  listLocations,
};
