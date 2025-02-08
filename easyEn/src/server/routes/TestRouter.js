import { Router } from "express";
import TestContorller from "../controllers/TestContorller.js";

export const router = new Router();

router.post('/', TestContorller.create)
router.get('/', TestContorller.getAll)
router.get('/:id', TestContorller.getOne);
