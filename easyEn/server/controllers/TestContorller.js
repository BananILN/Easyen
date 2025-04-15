// server/controllers/TestController.js
import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Test } = models;

class TestController {
    async create(req, res, next) {
        try {
            const { title, LessonID } = req.body;
            const testTitle = await Test.create({ title, LessonID });
            return res.json(testTitle);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const { LessonID } = req.query;
        const tests = await Test.findAll({
            where: LessonID ? { LessonID } : {},
        });
        return res.json(tests);
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        const test = await Test.findByPk(id);
        if (!test) {
            return next(ApiError.badRequest("Тест не найден"));
        }
        return res.json(test);
    }
}

export default new TestController();