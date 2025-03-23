import axios from "axios";

const API_URL = "http://localhost:3001";

export const obtenerLecturas = async () => {

  try {
    const response = await axios.get(`${API_URL}/sensor-lecturas`);
    if (!response.data || typeof response.data !== "object") {
      throw new Error("La API devolvió datos no válidos.");
    }
    return response.data;
  } 
  catch (error) {
    
    console.error("❌ Error al obtener los datos del backend:", error);
    return null;
  }
};
