// src/controllers/user.controller.js
import * as userService from "../services/user.service.js";
import bcrypt from "bcryptjs";

// Crear usuario
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol || "paciente",
    });

    res.status(201).json({ message: "Usuario creado exitosamente", user });
  } catch (error) {
    console.error("Error en registerUser:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Listar usuarios
export const listUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error en listUsers:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
