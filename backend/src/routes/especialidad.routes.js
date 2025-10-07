import { Router } from "express";
import {
  addEspecialidad,
  listEspecialidades,
} from "../controllers/especialidad.controller.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, verifyRole(["admin"]), addEspecialidad); // solo admin
router.get("/", listEspecialidades); // público

export default router;
