const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');

const { processImages } = require('../utils/imageUpload');

// @desc    Fetch all properties, optionally filtered
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { propertyType, minPrice, maxPrice, bedrooms, bathrooms, featured, limit } = req.query;
  
  const filters = {
    limit: limit ? Number(limit) : undefined,
    propertyType: propertyType,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    // bathrooms: bathrooms ? Number(bathrooms) : undefined, // Property model does not have bathrooms filter
    isFeatured: featured === 'true' ? true : undefined,
  };

  // Remove undefined filters
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

  const properties = await Property.findAll(filters);
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
    
    // Extract base64 data URLs
    images = processedImages.map(img => img.data);
  }

  const property = new Property({
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
    user: req.user._id,
  });

  const createdProperty = await property.save();
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

  if (property.user.toString() !== req.user._id.toString()) {
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
    
    // Append new images to existing ones
    updateData.images = [...property.images, ...newImages];
  }

  // Update property fields
  Object.keys(updateData).forEach(key => {
    if (key === 'amenities' && typeof updateData[key] === 'string') {
      property[key] = JSON.parse(updateData[key]);
    } else {
      property[key] = updateData[key];
    }
  });

  const updatedProperty = await property.save();
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
    if (property.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this property');
    }
    
    await property.deleteOne();
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

  if (property.user.toString() !== req.user._id.toString()) {
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
  property.images = [...property.images, ...newImages];
  await property.save();

  res.status(200).json({
    success: true,
    images: newImages,
    totalImages: property.images.length,
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

  if (property.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  const imageIndex = parseInt(req.params.imageIndex);

  if (imageIndex < 0 || imageIndex >= property.images.length) {
    res.status(400);
    throw new Error('Invalid image index');
  }

  // Remove image at index
  property.images.splice(imageIndex, 1);
  await property.save();

  res.json({
    success: true,
    message: 'Image deleted successfully',
    remainingImages: property.images.length
  });
});

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
const searchProperties = asyncHandler(async (req, res) => {
  const { keyword, propertyType, minPrice, maxPrice, bedrooms } = req.query;
  
  const filters = {
    propertyType: propertyType,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
  };

  // Remove undefined filters
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

  const properties = await Property.search(keyword, filters);
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
  const properties = await Property.findAll({ ownerId: req.user._id, orderBy: 'createdAt', orderDirection: 'desc' });
  
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
