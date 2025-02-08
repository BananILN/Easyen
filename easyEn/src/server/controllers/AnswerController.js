import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Answer } = models;

class AnswerController{
    async create(req, res, next) {
        try {
            const { answerText, isCorrect, questionId } = req.body;
            const answer = await Answer.create({ AnswerText: answerText, IsCorrect: isCorrect, QuestionID: questionId });
            return res.json(answer);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const answers = await Answer.findAll();
        return res.json(answers);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        const answer = await Answer.findByPk(id);
        if (!answer) {
            return next(ApiError.notFound('Answer not found'));
        }
        return res.json(answer);
    }
}
export default new AnswerController();


