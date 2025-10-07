import { Router } from "express";
import {
  addMedico,
  listMedicos,
  listMedicosByEspecialidad,
} from "../controllers/medico.controller.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

// Solo admin puede registrar médicos
router.post("/", verifyToken, verifyRole(["admin"]), addMedico);

// Todos pueden listar médicos
router.get("/", listMedicos);

// Listar médicos por especialidad
router.get("/especialidad/:especialidad_id", listMedicosByEspecialidad);

export default router;
