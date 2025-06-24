import { Router } from "express";
import AdminController from "../controllers/AdminController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.get("/users", CheckRole("ADMIN"), AdminController.getAllUsers);
router.get("/users/:userId", CheckRole("ADMIN"), AdminController.getUserById); // Новый маршрут
router.get("/progress/:userId", CheckRole("ADMIN"), AdminController.getProgressForUser);
router.delete("/users/:userId",CheckRole("ADMIN"), AdminController.deleteUser);