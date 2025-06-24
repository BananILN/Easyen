import { Router } from "express";
import TestController from "../controllers/TestContorller.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/', CheckRole("ADMIN"), TestController.create);
router.get('/', TestController.getAll);
router.get('/:id', TestController.getOne);
router.put('/:id', CheckRole("ADMIN"), TestController.update); 
router.delete('/:id', CheckRole("ADMIN"), TestController.delete);
