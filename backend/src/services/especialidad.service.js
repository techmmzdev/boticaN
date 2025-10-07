import pool from "../config/db.js";

// Crear especialidad
export const createEspecialidad = async ({ nombre, descripcion }) => {
  const [result] = await pool.query(
    "INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)",
    [nombre, descripcion]
  );
  return { id: result.insertId, nombre, descripcion };
};

// Listar todas las especialidades
export const getEspecialidades = async () => {
  const [rows] = await pool.query("SELECT * FROM especialidades");
  return rows;
};
