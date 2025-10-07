// src/config/db.js
import mysql from "mysql2/promise";
import { env } from "./env.js";

let pool;

try {
  pool = mysql.createPool({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ Conectado a la base de datos MySQL");
} catch (error) {
  console.error("❌ Error al conectar a MySQL:", error);
}

export default pool;
