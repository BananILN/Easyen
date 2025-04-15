// server/controllers/TestResultController.js
import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { TestResult } = models;

class TestResultController {
    async create(req, res, next) {
        try {
            const { score, testId, userId } = req.body;
            const result = await TestResult.create({ Score: score, TestID: testId, UserID: userId });
            return res.json(result); // Отправляем ответ один раз
        } catch (e) {
            next(ApiError.badRequest(e.message)); // Передаём ошибку в middleware
        }
    }

    async getAll(req, res) {
        const results = await TestResult.findAll();
        return res.json(results);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        const result = await TestResult.findByPk(id);
        if (!result) {
            return next(ApiError.notFound('Результат теста не найден'));
        }
        return res.json(result);
    }
}

export default new TestResultController();