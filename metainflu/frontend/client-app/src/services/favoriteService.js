
import { apiClient } from '../config/api';

const getFavorites = () => {
  return apiClient.get('/favorites');
};

const addFavorite = (id) => {
  return apiClient.post(`/favorites/${id}`);
};

const removeFavorite = (id) => {
  return apiClient.delete(`/favorites/${id}`);
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
