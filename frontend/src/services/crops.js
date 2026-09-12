// Crops API


// Crops API
import api from "./api.js";
 
export function getCrops() {
  return api.get("/api/crops").then((r) => r.data.crops);
}
 
