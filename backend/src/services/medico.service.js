import pool from "../config/db.js";

// Asociar un usuario a una especialidad como médico
export const createMedico = async ({ user_id, especialidad_id }) => {
  const [result] = await pool.query(
    `INSERT INTO medicos (user_id, especialidad_id) VALUES (?, ?)`,
    [user_id, especialidad_id]
  );
  return { id: result.insertId, user_id, especialidad_id };
};

// Listar todos los médicos con su especialidad
export const getMedicos = async () => {
  const [rows] = await pool.query(`
    SELECT m.id, u.nombre, u.apellido, u.email, e.nombre AS especialidad
    FROM medicos m
    JOIN users u ON m.user_id = u.id
    JOIN especialidades e ON m.especialidad_id = e.id
  `);
  return rows;
};

// Listar médicos por especialidad
export const getMedicosByEspecialidad = async (especialidad_id) => {
  const [rows] = await pool.query(
    `
    SELECT m.id, u.nombre, u.apellido, u.email, e.nombre AS especialidad
    FROM medicos m
    JOIN users u ON m.user_id = u.id
    JOIN especialidades e ON m.especialidad_id = e.id
    WHERE e.id = ?
    `,
    [especialidad_id]
  );
  return rows;
};
