const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const register = async (nombre, apellido, email, password, rol) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, apellido, email, password, rol }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al registrarse");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en register:", error);
    throw error;
  }
};

export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw error;
  }
};
