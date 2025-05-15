import { Router } from "express";
import TestResultController from "../controllers/TestResultController.js";



export const router = new Router();

router.get('/', TestResultController.getStatistics);