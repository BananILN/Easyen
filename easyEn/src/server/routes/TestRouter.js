import { Router } from "express";
import TestContorller from "../controllers/TestContorller.js";
 import CheckRole from "../middleware/checkRoleMiddleware.js";
export const router = new Router();

router.post('/', CheckRole("ADMIN"), TestContorller.create)
router.get('/', TestContorller.getAll)
router.get('/:id', TestContorller.getOne);
