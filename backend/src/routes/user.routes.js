// src/routes/user.routes.js
import { Router } from "express";
import { registerUser, listUsers } from "../controllers/user.controller.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser); // Registro de usuario
router.get("/", verifyToken, verifyRole(["admin"]), listUsers);

export default router;
