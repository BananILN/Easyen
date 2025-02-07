import { Router } from "express";
import ProgressController from "../controllers/ProgressController.js";


export const router = new Router();

router.post('/', ProgressController.create)
router.get('/', ProgressController.getAll)
