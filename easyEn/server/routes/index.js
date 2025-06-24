import { Router } from "express";
import {router as answerRouter} from "./AnswerRouter.js"
import {router as lessonRouter} from "./LessonRouter.js"
import {router as questionRouter} from "./QuestionRouter.js"
import {router as testRouter} from "./TestRouter.js"
import {router as testResultRouter} from "./TestResultRouter.js"
import {router as userRouter} from "./UserRouter.js"
import {router as roleRouter} from  "./RoleRouter.js"
import {router as ProgressRouter} from  "./ProgressRouter.js"
import {router as ProfileRouter} from "./ProfileRouter.js"
import { router as UserAnswerRouter } from "./UserAnswerRouter.js";
import {router as StatisticRouter} from "./StatisticRouter.js"
import { router as AdminRouter } from "./AdminRouter.js";

export const router = new Router();

router.use("/profile", ProfileRouter)
router.use('/user',userRouter)
router.use('/lesson',lessonRouter)
router.use('/test',testRouter)
router.use('/question',questionRouter)
router.use('/answer', answerRouter)
router.use('/testResult',testResultRouter)
router.use('/role',roleRouter)
router.use('/progress',ProgressRouter)
router.use('/userAnswer', UserAnswerRouter);
router.use('/statistics',StatisticRouter)
router.use("/admin", AdminRouter);


