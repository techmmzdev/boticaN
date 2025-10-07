import { Router } from "express";
import {
  addHorario,
  listHorariosByMedico,
  removeHorario,
} from "../controllers/horario.controller.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

// Solo el médico o admin pueden crear horarios
router.post("/", verifyToken, verifyRole(["medico", "admin"]), addHorario);

// Ver horarios de un médico (público)
router.get("/medico/:medico_id", listHorariosByMedico);

// Eliminar horario (solo medico/admin)
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["medico", "admin"]),
  removeHorario
);

export default router;
