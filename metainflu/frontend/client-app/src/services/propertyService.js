
import { apiClient } from '../config/api';

const getProperties = (params) => {
  return apiClient.get('/properties', { params });
};

const getPropertyById = (id) => {
  return apiClient.get(`/properties/${id}`);
};

const createProperty = (propertyData) => {
  return apiClient.post('/properties', propertyData);
};

const updateProperty = (id, propertyData) => {
  return apiClient.put(`/properties/${id}`, propertyData);
};

const deleteProperty = (id) => {
  return apiClient.delete(`/properties/${id}`);
};

export default {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
