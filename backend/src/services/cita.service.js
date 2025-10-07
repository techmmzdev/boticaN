import pool from "../config/db.js";

// Crear cita
export const createCita = async ({ paciente_id, medico_id, fecha, hora }) => {
  // Verificar que no haya cita duplicada
  const [exists] = await pool.query(
    `SELECT * FROM citas 
     WHERE medico_id = ? AND fecha = ? AND hora = ? AND estado != 'cancelada'`,
    [medico_id, fecha, hora]
  );

  if (exists.length > 0) {
    throw new Error("Ese horario ya está reservado con el médico");
  }

  // Insertar cita
  const [result] = await pool.query(
    `INSERT INTO citas (paciente_id, medico_id, fecha, hora, estado) 
     VALUES (?, ?, ?, ?, 'pendiente')`,
    [paciente_id, medico_id, fecha, hora]
  );

  return {
    id: result.insertId,
    paciente_id,
    medico_id,
    fecha,
    hora,
    estado: "pendiente",
  };
};

// Listar citas de un paciente
export const getCitasByPaciente = async (paciente_id) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.fecha, c.hora, c.estado, 
            u.nombre AS medico_nombre, u.apellido AS medico_apellido, e.nombre AS especialidad
     FROM citas c
     JOIN medicos m ON c.medico_id = m.id
     JOIN users u ON m.user_id = u.id
     JOIN especialidades e ON m.especialidad_id = e.id
     WHERE c.paciente_id = ?
     ORDER BY c.fecha, c.hora`,
    [paciente_id]
  );
  return rows;
};

// Listar citas de un médico
export const getCitasByMedico = async (medico_id) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.fecha, c.hora, c.estado, 
            u.nombre AS paciente_nombre, u.apellido AS paciente_apellido
     FROM citas c
     JOIN users u ON c.paciente_id = u.id
     WHERE c.medico_id = ?
     ORDER BY c.fecha, c.hora`,
    [medico_id]
  );
  return rows;
};

// Actualizar estado de cita
export const updateCitaEstado = async (id, estado) => {
  await pool.query(`UPDATE citas SET estado = ? WHERE id = ?`, [estado, id]);
  return { id, estado };
};

// Listar todas las citas (solo para admin)
export const getAllCitas = async () => {
  const [rows] = await pool.query(
    `SELECT c.id, c.fecha, c.hora, c.estado,
            u1.nombre AS paciente_nombre, u1.apellido AS paciente_apellido,
            u2.nombre AS medico_nombre, u2.apellido AS medico_apellido,
            e.nombre AS especialidad
     FROM citas c
     JOIN users u1 ON c.paciente_id = u1.id
     JOIN medicos m ON c.medico_id = m.id
     JOIN users u2 ON m.user_id = u2.id
     JOIN especialidades e ON m.especialidad_id = e.id
     ORDER BY c.fecha, c.hora`
  );
  return rows;
};
