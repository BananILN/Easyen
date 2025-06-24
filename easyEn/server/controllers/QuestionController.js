import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';
import { Op } from 'sequelize';
import { sequelize } from '../db.js';

const { Question, Answer, UserAnswer } = models;

class QuestionController {
  async create(req, res, next) {
    try {
      const { questionText, isMultipleChoice, testID } = req.body;
      const question = await Question.create({ QuestionText: questionText, IsMultipleChoice: isMultipleChoice, TestID: testID });
      return res.json(question);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const { TestID } = req.query;
    const questions = await Question.findAll({
      where: TestID ? { TestID } : {},
    });
    return res.json(questions);
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) {
      return next(ApiError.badRequest("Вопрос не найден"));
    }
    return res.json(question);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { questionText, isMultipleChoice, testID } = req.body;

      const question = await Question.findByPk(id);
      if (!question) {
        return next(ApiError.badRequest("Вопрос не найден"));
      }

      await question.update({ QuestionText: questionText, IsMultipleChoice: isMultipleChoice, TestID: testID });
      return res.json(question);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const questionId = parseInt(id, 10);
      console.log(`Попытка удаления вопроса с ID: ${questionId}`);

      const question = await Question.findByPk(questionId);
      if (!question) {
        return next(ApiError.badRequest(`Вопрос с ID ${questionId} не найден`));
      }

      await sequelize.transaction(async (transaction) => {
        // Удаляем связанные записи в UserAnswer
        await UserAnswer.destroy({ where: { QuestionID: questionId }, transaction });
        // Удаляем связанные ответы
        await Answer.destroy({ where: { QuestionID: questionId }, transaction });
        // Удаляем сам вопрос
        await question.destroy({ transaction });
      });

      console.log(`Вопрос с ID ${questionId} успешно удален`);
      return res.json({ message: "Вопрос успешно удален" });
    } catch (e) {
      console.error(`Ошибка при удалении вопроса с ID ${id}: ${e.message}`);
      return next(ApiError.badRequest(`Ошибка при удалении вопроса: ${e.message}`));
    }
  }
}

export default new QuestionController();