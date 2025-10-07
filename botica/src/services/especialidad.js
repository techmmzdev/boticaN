const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = `${API_URL}/especialidades`; // Asumiendo que montaste las rutas aquí

// Función auxiliar para obtener el token de autenticación (Necesario para 'add')
const getAuthHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    // Incluir el token para rutas protegidas por admin
    Authorization: `Bearer ${token}`,
  };
};

// =================================================================
// 1. CREAR NUEVA ESPECIALIDAD (Ruta protegida por Admin)
// POST /api/especialidades
// =================================================================
/**
 * Crea una nueva especialidad en el backend.
 * @param {string} nombre - Nombre de la especialidad.
 * @param {string} descripcion - Descripción opcional de la especialidad.
 * @param {string} token - Token JWT del administrador.
 */
export const addEspecialidad = async (nombre, descripcion = "", token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ nombre, descripcion }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message ||
          "Error al crear la especialidad. ¿Tienes permisos de administrador?"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en addEspecialidad:", error);
    throw error;
  }
};

// =================================================================
// 2. LISTAR TODAS LAS ESPECIALIDADES (Ruta pública)
// GET /api/especialidades
// =================================================================
/**
 * Obtiene la lista de todas las especialidades.
 */
export const getAllEspecialidades = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener la lista de especialidades."
      );
    }

    // Devolvemos el array de especialidades
    return await response.json();
  } catch (error) {
    console.error("Error en getAllEspecialidades:", error);
    throw error;
  }
};
