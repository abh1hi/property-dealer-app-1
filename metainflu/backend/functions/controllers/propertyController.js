const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');
const { processImages } = require('../utils/imageUpload');

// @desc    Fetch all properties, optionally filtered
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.findAll(req.query);
  res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

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

  // Process uploaded images
  let images = [];
  if (req.files && req.files.length > 0) {
    const processedImages = await processImages(req.files, {
      maxSizeInBytes: 2 * 1024 * 1024, // 2MB
      quality: 80,
      format: 'webp'
    });
    
    images = processedImages.map(img => img.data);
  }

  const propertyData = {
    title,
    description,
    price,
    address,
    latitude: latitude ? Number(latitude) : undefined,
    longitude: longitude ? Number(longitude) : undefined,
    propertyType,
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    area: Number(area),
    amenities: amenities ? (Array.isArray(amenities) ? amenities : JSON.parse(amenities)) : [],
    images,
    user: req.user.id,
  };

  const createdProperty = await Property.create(propertyData);
  res.status(201).json({
    success: true,
    data: createdProperty,
    message: 'Property created successfully'
  });
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const updateData = req.body;

  const property = await Property.findById(propertyId);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.user !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  // Process new uploaded images if any
  if (req.files && req.files.length > 0) {
    const processedImages = await processImages(req.files, {
      maxSizeInBytes: 2 * 1024 * 1024,
      quality: 80,
      format: 'webp'
    });
    
    const newImages = processedImages.map(img => img.data);
    
    updateData.images = [...property.images, ...newImages];
  }

  const updatedProperty = await Property.update(propertyId, updateData);
  res.json({
    success: true,
    data: updatedProperty,
    message: 'Property updated successfully'
  });
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    if (property.user !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this property');
    }
    
    await Property.hardDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Property removed' 
    });
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

// @desc    Upload images to existing property
// @route   POST /api/properties/:id/images
// @access  Private
const uploadPropertyImages = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.user !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  // Check total image count
  if (property.images.length + req.files.length > 10) {
    res.status(400);
    throw new Error('Maximum 10 images allowed per property');
  }

  // Process uploaded images
  const processedImages = await processImages(req.files, {
    maxSizeInBytes: 2 * 1024 * 1024,
    quality: 80,
    format: 'webp'
  });
  
  const newImages = processedImages.map(img => img.data);
  
  // Add new images to property
  const updatedImages = [...property.images, ...newImages];
  await Property.update(req.params.id, { images: updatedImages });

  res.status(200).json({
    success: true,
    images: newImages,
    totalImages: updatedImages.length,
    message: 'Images uploaded successfully'
  });
});

// @desc    Delete specific image from property
// @route   DELETE /api/properties/:id/images/:imageIndex
// @access  Private
const deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.user !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  const imageIndex = parseInt(req.params.imageIndex);

  if (imageIndex < 0 || imageIndex >= property.images.length) {
    res.status(400);
    throw new Error('Invalid image index');
  }

  // Remove image at index
  const updatedImages = [...property.images];
  updatedImages.splice(imageIndex, 1);
  await Property.update(req.params.id, { images: updatedImages });

  res.json({
    success: true,
    message: 'Image deleted successfully',
    remainingImages: updatedImages.length
  });
});

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
const searchProperties = asyncHandler(async (req, res) => {
  const properties = await Property.search(req.query.keyword, req.query);
  res.json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get user's properties
// @route   GET /api/properties/user/my-properties
// @access  Private
const getUserProperties = asyncHandler(async (req, res) => {
  const properties = await Property.findAll({ ownerId: req.user.id });
  
  res.json({
    success: true,
    count: properties.length,
    data: properties
  });
});

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  deletePropertyImage,
  searchProperties,
  getUserProperties
};
