const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');
const { processImages } = require('../utils/imageUpload');

// ... other controllers ...

// @desc    Create a property with images
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    latitude,
    longitude,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    amenities,
  } = req.body;

  let images = [];
  if (req.files && req.files.length > 0) {
    const processedImages = await processImages(req.files, {
      maxSizeInBytes: 2 * 1024 * 1024, // 2MB
      quality: 80,
      format: 'webp'
    });
    images = processedImages.map(img => img.data);
  }

  // PATCH: Firestore/Custom Model usage (No 'save' method)
  // Use Property.create static method
  const amenitiesArr = amenities ? (Array.isArray(amenities) ? amenities : JSON.parse(amenities)) : [];
  const propertyData = {
    title,
    description,
    price: Number(price),
    address,
    latitude: latitude ? Number(latitude) : undefined,
    longitude: longitude ? Number(longitude) : undefined,
    propertyType,
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    area: Number(area),
    amenities: amenitiesArr,
    images,
    ownerId: req.user._id,
    // Any other defaults, e.g. status: 'active'
  };
  const createdProperty = await Property.create(propertyData);
  res.status(201).json({
    success: true,
    data: createdProperty,
    message: 'Property created successfully'
  });
});

// ... ensure similar updates (updateProperty, etc.) use Propery.update(), not .save ...

module.exports = {
  // ... other exports ...
  createProperty,
  // ...
};
