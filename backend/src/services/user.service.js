// src/services/user.service.js
import pool from "../config/db.js";

// Crear un nuevo usuario
export const createUser = async ({
  nombre,
  apellido,
  email,
  password,
  rol,
}) => {
  const [result] = await pool.query(
    `INSERT INTO users (nombre, apellido, email, password, rol) 
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, email, password, rol]
  );
  return { id: result.insertId, nombre, apellido, email, rol };
};

// Buscar usuario por email (para login)
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
};

// Listar todos los usuarios
export const getAllUsers = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, apellido, email, rol, activo FROM users`
  );
  return rows;
};
