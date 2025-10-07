// src/services/auth.service.js
import pool from "../config/db.js";
import { getUserByEmail } from "./user.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { env } from "../config/env.js";

export const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Contraseña incorrecta");
  } // ---------------------------------------------------- // PASO CLAVE: OBTENER EL MEDICO_ID SI EL ROL ES 'medico' // ----------------------------------------------------

  let medicoId = null;

  if (user.rol === "medico") {
    const [medicoRows] = await pool.query(
      `SELECT id FROM medicos WHERE user_id = ?`,
      [user.id]
    );
    if (medicoRows.length > 0) {
      medicoId = medicoRows[0].id;
    } else {
      // Manejo de error si un usuario marcado como 'medico' no está en la tabla 'medicos'
      console.error(
        `Alerta: Médico con user_id ${user.id} no tiene registro en la tabla 'medicos'.`
      );
    }
  } // ---------------------------------------------------- // Generar token (Añadir medicoId al payload del token)
  const token = jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      medico_id: medicoId, // <- ¡Añadido!
    },
    process.env.JWT_SECRET || "secreto",
    { expiresIn: "2h" }
  ); // Retornar user sin contraseña (Añadir medicoId al objeto user devuelto al frontend)

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      medico_id: medicoId, // <- ¡Añadido!
    },
  };
};
