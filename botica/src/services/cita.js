const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * 🩺 Crear una nueva cita (paciente autenticado)
 */
export const createCita = async (token, { medico_id, fecha, hora }) => {
  const res = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ medico_id, fecha, hora }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.message || "Error al crear cita");

  // Tu backend devuelve { message, cita }
  return data.cita;
};

/**
 * 👤 Obtener citas del paciente autenticado
 */
export const getCitasPaciente = async (token) => {
  const res = await fetch(`${API_URL}/citas/paciente`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.message || "Error al obtener citas");

  // Devuelve directamente un array
  return data;
};

/**
 * 🧑‍⚕️ Obtener citas de un médico específico (solo médico o admin)
 */
export const getCitasMedico = async (token, medico_id) => {
  const res = await fetch(`${API_URL}/citas/medico/${medico_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok)
    throw new Error(data?.message || "Error al obtener citas del médico");

  return data;
};

/**
 * 🔄 Cambiar el estado de una cita (confirmar, cancelar, completar)
 */
export const updateCitaEstado = async (token, id, estado) => {
  const res = await fetch(`${API_URL}/citas/${id}/estado`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.message || "Error al actualizar cita");

  // Devuelve { message, result }
  return data.result;
};

// cita.js (Actual)
export const getAllCitas = async (token) => {
  const res = await fetch(`${API_URL}/citas`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({})); // <-- ¡Aquí está el punto!

  if (!res.ok)
    throw new Error(data?.message || "Error al obtener todas las citas");

  return data; // devuelve directamente un array
};
