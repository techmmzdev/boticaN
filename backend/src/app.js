// server.js
import express from "express";
import { env } from "./config/env.js";
import pool from "./config/db.js";
import cors from "cors";

// Rutas
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import especialidadRoutes from "./routes/especialidad.routes.js";
import medicoRoutes from "./routes/medico.routes.js";
import horarioRoutes from "./routes/horario.routes.js";
import citaRoutes from "./routes/cita.routes.js";

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/especialidades", especialidadRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/citas", citaRoutes);

// Ruta de prueba
app.get("/", async (req, res) => {
  try {
    // Probamos conexión a la BD
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.send(
      `🚀 Servidor de Citas Médicas funcionando! BD OK -> ${rows[0].fecha}`
    );
  } catch (error) {
    console.error("Error consultando BD:", error);
    res.status(500).send("Error en la base de datos");
  }
});

// Iniciar servidor
app.listen(env.port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${env.port}`);
  console.log(`👉 http://localhost:${env.port}`);
});
