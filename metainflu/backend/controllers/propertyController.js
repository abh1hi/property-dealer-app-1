const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Fetch all properties, optionally filtered
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { propertyType, minPrice, maxPrice, bedrooms, bathrooms, latitude, longitude, address, featured, limit } = req.query;
  let filter = {};

  if (propertyType) {
    filter.propertyType = propertyType;
  }
  if (minPrice) {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }
  if (maxPrice) {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }
  if (bedrooms) {
    filter.bedrooms = Number(bedrooms);
  }
  if (bathrooms) {
    filter.bathrooms = Number(bathrooms);
  }
  if (address) {
    filter.address = { $regex: address, $options: 'i' };
  }
  if (latitude && longitude) {
    filter.latitude = Number(latitude);
    filter.longitude = Number(longitude);
  }
  if (featured === 'true') {
    filter.isFeatured = true;
  }

  let query = Property.find(filter);

  if (limit) {
    query = query.limit(Number(limit));
  }

  const properties = await query;
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

// @desc    Create a property
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
    images,
  } = req.body;

  const property = new Property({
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
    images,
    user: req.user._id,
  });

  const createdProperty = await property.save();
  res.status(201).json(createdProperty);
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

  Object.keys(updateData).forEach(key => {
    property[key] = updateData[key];
  });

  const updatedProperty = await property.save();
  res.json(updatedProperty);
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
    res.json({ message: 'Property removed' });
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  if (req.files) {
    const images = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ images });
  } else {
    res.status(400);
    throw new Error('No images uploaded');
  }
});

const searchProperties = asyncHandler(async (req, res) => {
  const { keyword, propertyType, minPrice, maxPrice, bedrooms, bathrooms, latitude, longitude, address } = req.query;
  let filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { address: { $regex: keyword, $options: 'i' } }, // Search keyword in address too
    ];
  }

  if (propertyType) {
    filter.propertyType = propertyType;
  }
  if (minPrice) {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }
  if (maxPrice) {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }
  if (bedrooms) {
    filter.bedrooms = Number(bedrooms);
  }
  if (bathrooms) {
    filter.bathrooms = Number(bathrooms);
  }
  if (address) {
    filter.address = { $regex: address, $options: 'i' };
  }
  // Add location-based filtering if both latitude and longitude are provided
  if (latitude && longitude) {
    filter.latitude = Number(latitude);
    filter.longitude = Number(longitude);
  }

  const properties = await Property.find(filter);
  res.json(properties);
});

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadImages,
  searchProperties,
};
