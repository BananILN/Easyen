import { Router } from "express";
import userController from "../controllers/userController.js"; 
import  authMiddleware  from "../middleware/authMiddleware.js";


export const router = new Router();

router.post('/registration',userController.registration)

router.post('/login',userController.login)
router.get('/auth', authMiddleware , userController.cheeck)