import { Router } from "express";
import userController from "../controllers/userController";

export const router = new Router();

router.post('/registration',userController.regisration)
router.post('/login',userController.login)
router.get('/auth',userController.cheeck)