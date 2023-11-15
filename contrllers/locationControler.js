const SquareBaseURL = require('../apiConstrains/apiList'); 

const listLocations = async (req, res) => {
  try {
    const response = await SquareBaseURL.get('/v2/locations');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  listLocations,
};