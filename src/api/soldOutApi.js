import { apiClient } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/api.js";

export const soldOutApi = {
  listSoldOutCatalog: () => apiClient.get(API_ENDPOINTS.soldOut),
  patchSoldOut: (changes) => apiClient.patch(API_ENDPOINTS.soldOut, { changes }),
};
