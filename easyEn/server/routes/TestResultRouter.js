import { Router } from "express";
import TestResultController from "../controllers/TestResultController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/',CheckRole("ADMIN"),  TestResultController.create)
router.get('/', TestResultController.getAll)
