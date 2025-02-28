import { Router } from "express";
import RoleController from "../controllers/RoleController.js";


export const router = new Router();

router.post('/',RoleController.create)
router.get('/', RoleController.getAll)
