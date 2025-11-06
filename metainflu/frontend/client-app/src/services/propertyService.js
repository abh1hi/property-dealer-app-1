import { apiClient } from '../config/api';

/**
 * Validate property data before sending to backend
 */
const validatePropertyData = (propertyData) => {
  const errors = [];

  // Required fields validation
  if (!propertyData.title || propertyData.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!propertyData.description || propertyData.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!propertyData.price || propertyData.price <= 0) {
    errors.push('Valid price is required');
  }

  if (!propertyData.address || propertyData.address.trim() === '') {
    errors.push('Address is required');
  }

  if (!propertyData.propertyType || propertyData.propertyType.trim() === '') {
    errors.push('Property type is required');
  }

  // Validate propertyType enum
  const validTypes = ['apartment', 'house', 'land', 'commercial'];
  if (propertyData.propertyType && !validTypes.includes(propertyData.propertyType)) {
    errors.push(`Property type must be one of: ${validTypes.join(', ')}`);
  }

  if (!propertyData.bedrooms || propertyData.bedrooms < 0) {
    errors.push('Valid number of bedrooms is required');
  }

  if (!propertyData.bathrooms || propertyData.bathrooms < 0) {
    errors.push('Valid number of bathrooms is required');
  }

  if (!propertyData.area || propertyData.area <= 0) {
    errors.push('Valid area is required');
  }

  // Optional fields validation
  if (propertyData.latitude !== undefined && propertyData.latitude !== null) {
    if (propertyData.latitude < -90 || propertyData.latitude > 90) {
      errors.push('Latitude must be between -90 and 90');
    }
  }

  if (propertyData.longitude !== undefined && propertyData.longitude !== null) {
    if (propertyData.longitude < -180 || propertyData.longitude > 180) {
      errors.push('Longitude must be between -180 and 180');
    }
  }

  return errors;
};

/**
 * Format property data for backend API
 */
const formatPropertyData = (propertyData) => {
  return {
    title: propertyData.title?.trim(),
    description: propertyData.description?.trim(),
    price: Number(propertyData.price),
    address: propertyData.address?.trim(),
    latitude: propertyData.latitude ? Number(propertyData.latitude) : undefined,
    longitude: propertyData.longitude ? Number(propertyData.longitude) : undefined,
    propertyType: propertyData.propertyType?.trim().toLowerCase(),
    bedrooms: Number(propertyData.bedrooms),
    bathrooms: Number(propertyData.bathrooms),
    area: Number(propertyData.area),
    amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
    images: Array.isArray(propertyData.images) ? propertyData.images : [],
  };
};

/**
 * Get all properties with optional filters
 */
const getProperties = async (params = {}) => {
  try {
    // Format query parameters
    const queryParams = {};

    if (params.propertyType) queryParams.propertyType = params.propertyType;
    if (params.minPrice) queryParams.minPrice = params.minPrice;
    if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params.bedrooms) queryParams.bedrooms = params.bedrooms;
    if (params.bathrooms) queryParams.bathrooms = params.bathrooms;
    if (params.latitude) queryParams.latitude = params.latitude;
    if (params.longitude) queryParams.longitude = params.longitude;
    if (params.address) queryParams.address = params.address;

    const data = await apiClient.get('/properties', queryParams);
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Get a single property by ID
 */
const getPropertyById = async (id) => {
  if (!id || id.trim() === '') {
    throw new Error('Property ID is required');
  }

  try {
    const data = await apiClient.get(`/properties/${id.trim()}`);
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

/**
 * Create a new property
 */
const createProperty = async (propertyData) => {
  // Validate data
  const errors = validatePropertyData(propertyData);
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }

  // Format data
  const formattedData = formatPropertyData(propertyData);

  try {
    const data = await apiClient.post('/properties', formattedData);
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

/**
 * Update an existing property
 */
const updateProperty = async (id, propertyData) => {
  if (!id || id.trim() === '') {
    throw new Error('Property ID is required');
  }

  // Validate data
  const errors = validatePropertyData(propertyData);
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }

  // Format data
  const formattedData = formatPropertyData(propertyData);

  try {
    const data = await apiClient.put(`/properties/${id.trim()}`, formattedData);
    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

/**
 * Delete a property
 */
const deleteProperty = async (id) => {
  if (!id || id.trim() === '') {
    throw new Error('Property ID is required');
  }

  try {
    const data = await apiClient.delete(`/properties/${id.trim()}`);
    return data;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

/**
 * Search properties with keyword
 */
const searchProperties = async (params = {}) => {
  try {
    const queryParams = {};

    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.propertyType) queryParams.propertyType = params.propertyType;
    if (params.minPrice) queryParams.minPrice = params.minPrice;
    if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params.bedrooms) queryParams.bedrooms = params.bedrooms;
    if (params.bathrooms) queryParams.bathrooms = params.bathrooms;
    if (params.latitude) queryParams.latitude = params.latitude;
    if (params.longitude) queryParams.longitude = params.longitude;
    if (params.address) queryParams.address = params.address;

    const data = await apiClient.get('/search', queryParams);
    return data;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

export default {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  validatePropertyData,
  formatPropertyData,
};
