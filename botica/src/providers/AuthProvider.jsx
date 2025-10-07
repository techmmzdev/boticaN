// src/providers/AuthProvider.jsx (CORREGIDO)

import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
// ASUMIMOS que authService.register NO HACE NINGUNA MANIPULACIÓN DE SESIÓN INTERNA
import * as authService from "@/services/authService.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect para cargar desde localStorage, sin cambios)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // 🔹 Iniciar sesión (flujo de login normal, guarda la sesión)
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { user, token } = response;

    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // 🔹 REGISTRO DE USUARIO FINAL (REGISTRA Y AUTENTICA INMEDIATAMENTE)
  const register = async (nombre, apellido, email, password, rol) => {
    const response = await authService.register(
      nombre,
      apellido,
      email,
      password,
      rol
    );

    const { user, token } = response;

    // Cuando un usuario se registra por sí mismo, queremos loguearlo.
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response; // Se recomienda devolver la respuesta
  };

  // 🚀 NUEVA FUNCIÓN: REGISTRO POR ADMINISTRADOR (SOLO CREA EL USUARIO)
  // Esta función no llama a setToken/setUser, manteniendo la sesión del administrador.
  const adminRegisterUser = async (nombre, apellido, email, password, rol) => {
    // Llama al servicio de registro, pero IGNORAMOS la respuesta (token/user del nuevo usuario).
    const response = await authService.register(
      nombre,
      apellido,
      email,
      password,
      rol
    );
    // IMPORTANTE: NO hacemos setToken/setUser aquí.
    return response;
  };

  // 🔹 Cerrar sesión (sin cambios)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 🔹 Proveer el contexto a toda la app
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        adminRegisterUser, // 👈 Exportamos la nueva función
        isAuthenticated: Boolean(user && token),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
