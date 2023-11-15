const SquareBaseURL = require('../apiConstrains/apiList'); 

const listallCatalogs = async (req, res) => {
  try {
    const response = await SquareBaseURL.get('/v2/catalog/list', {
      headers: {
        'Square-Version': '2023-10-18',
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const filterCatalogsByLocation = async (req, res) => {
    const locationId = req.params.locationId; // Assuming you're passing the location ID as a parameter
  
    try {
      const response = await SquareBaseURL.get('/v2/catalog/list', {
        headers: {
          'Square-Version': '2023-10-18',
          'Content-Type': 'application/json',
        },
      });
  
      const filteredCatalogs = response.data.objects.filter(item => {
        // Check if the item is present at the specified location
        return (
          item.present_at_all_locations || 
          (item.present_at_location_ids && item.present_at_location_ids.includes(locationId))
        );
      });
  
      res.json(filteredCatalogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const getItemDetails = async (req, res) => {
    const itemId = req.params.itemId; // Assuming you're passing the item ID as a parameter
  
    try {
      const response = await SquareBaseURL.post('/v2/catalog/search-catalog-items', {
        object_types: ['ITEM'],
        query: {
          exact_query: {
            attribute_name: 'id',
            attribute_value: itemId,
          },
        },
      }, {
        headers: {
          'Square-Version': '2023-10-18',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.objects.length > 0) {
        res.json(response.data.objects[0]); // Assuming only one item should match the ID
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
module.exports = {
  listallCatalogs,
  filterCatalogsByLocation,
  getItemDetails
};