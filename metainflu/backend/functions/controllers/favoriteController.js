const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findByUser(req.user.id);
    if (!favorite) {
      return res.json([]);
    }
    const properties = await Promise.all(
      favorite.properties.map(id => Property.findById(id))
    );
    res.json(properties.filter(p => p)); // Filter out any null properties
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add property to favorites
// @route   POST /api/favorites/:id
// @access  Private
exports.addFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updatedFavorite = await Favorite.add(req.user.id, id);
    const properties = await Promise.all(
      updatedFavorite.properties.map(id => Property.findById(id))
    );
    res.status(201).json(properties.filter(p => p));

  } catch (error) {
    if (error.message === 'Property already in favorites') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
exports.removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedFavorite = await Favorite.remove(req.user.id, id);

    if (!updatedFavorite) {
        return res.status(404).json({ message: 'Favorite not found for user.' });
    }

    const properties = await Promise.all(
        updatedFavorite.properties.map(id => Property.findById(id))
    );
    res.json(properties.filter(p => p));

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
