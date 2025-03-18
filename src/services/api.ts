import axios from "axios";

const API_URL = "/api"; 

export const getIotData = async () => {
  try {
    const response = await axios.get(API_URL);
    if (!response.data || typeof response.data !== "object") {
      throw new Error("La API devolvió datos no válidos.");
    }
    return response.data;
  } catch (error) {
    console.error("🚨 Error al obtener los datos de la API:", error);
    return null;
  }
};
