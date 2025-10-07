// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y password son obligatorios" });
    }

    const result = await authService.loginUser(email, password);

    res.json({
      message: "Login exitoso",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(401).json({ message: error.message });
  }
};
