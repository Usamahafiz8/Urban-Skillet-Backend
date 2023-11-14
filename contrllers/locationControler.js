const SqureBaseURL = require('../Axios/squreUp')
const ApiList = require('../apiList/index')

const listLocations = async (req, res) => {
  try {
    // You can now use req.squareAxios to make requests with the Square authorization header
    const response = await req.squareAxios.get(`${SqureBaseURL}/${ApiList.listLocations}`);
    res.json(response.data);
  } catch (error) {
  
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  listLocations,
};
