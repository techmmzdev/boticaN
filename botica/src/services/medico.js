const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BASE_URL = `${API_URL}/medicos`; // La ruta base donde montaste medico.routes.js

// Función auxiliar para obtener el token de autenticación
// 💡 CORRECCIÓN: Cambiamos 'authToken' a 'token' para que coincida con AuthProvider.jsx
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json", // Incluir el token para rutas protegidas
    Authorization: `Bearer ${token}`,
  };
};

// =================================================================
// 1. REGISTRAR UN NUEVO MÉDICO (Ruta protegida por Admin)
// POST /api/medicos
// =================================================================
export const addMedico = async (userId, especialidadId) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        user_id: userId,
        especialidad_id: especialidadId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "No autorizado o error al registrar médico."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en addMedico:", error);
    throw error;
  }
};

// =================================================================
// 2. LISTAR TODOS LOS MÉDICOS (Ruta pública)
// GET /api/medicos
// =================================================================
export const listMedicos = async () => {
  try {
    // Esta ruta no requiere token.
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener la lista de médicos.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en listMedicos:", error);
    throw error;
  }
};

// =================================================================
// 3. LISTAR MÉDICOS POR ESPECIALIDAD (Ruta pública)
// GET /api/medicos/especialidad/:especialidad_id
// =================================================================
export const listMedicosByEspecialidad = async (especialidadId) => {
  try {
    const url = `${BASE_URL}/especialidad/${especialidadId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message ||
          `Error al obtener médicos de la especialidad ${especialidadId}.`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error en listMedicosByEspecialidad:", error);
    throw error;
  }
};

// Se asume que no hay otro archivo medico.js para exportar
// export * from "./medico.js";
