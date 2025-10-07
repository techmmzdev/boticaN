import pool from "../config/db.js";

// Crear horario para un médico
export const createHorario = async ({
  medico_id,
  dia_semana,
  hora_inicio,
  hora_fin,
}) => {
  const [result] = await pool.query(
    `INSERT INTO horarios (medico_id, dia_semana, hora_inicio, hora_fin)
     VALUES (?, ?, ?, ?)`,
    [medico_id, dia_semana, hora_inicio, hora_fin]
  );
  return { id: result.insertId, medico_id, dia_semana, hora_inicio, hora_fin };
};

// Listar horarios de un médico
export const getHorariosByMedico = async (medico_id) => {
  const [rows] = await pool.query(
    `SELECT id, dia_semana, hora_inicio, hora_fin
     FROM horarios WHERE medico_id = ?`,
    [medico_id]
  );
  return rows;
};

// Eliminar horario
export const deleteHorario = async (id) => {
  await pool.query(`DELETE FROM horarios WHERE id = ?`, [id]);
  return { message: "Horario eliminado" };
};
