import { Router } from "express";
import {
  addCita,
  listCitasPaciente,
  listCitasMedico,
  changeCitaEstado,
  listAllCitas,
} from "../controllers/cita.controller.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

// Paciente crea cita
router.post("/", verifyToken, verifyRole(["paciente"]), addCita);
// routes/cita.routes.js
router.get("/", verifyToken, verifyRole(["admin"]), listAllCitas);

// Paciente ve sus citas
router.get(
  "/paciente",
  verifyToken,
  verifyRole(["paciente"]),
  listCitasPaciente
);

// Médico ve sus citas
router.get(
  "/medico/:medico_id",
  verifyToken,
  verifyRole(["medico", "admin"]),
  listCitasMedico
);

// Cambiar estado de cita (admin o médico)
router.put(
  "/:id/estado",
  verifyToken,
  verifyRole(["medico", "admin"]),
  changeCitaEstado
);

export default router;
