import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Answer, UserAnswer } = models;

class AnswerController {
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
    const { QuestionID } = req.query;
    const answers = await Answer.findAll({
      where: QuestionID ? { QuestionID } : {},
    });
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

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { answerText, isCorrect, questionId } = req.body;

      const answer = await Answer.findByPk(id);
      if (!answer) {
        return next(ApiError.badRequest("Ответ не найден"));
      }

      await answer.update({ AnswerText: answerText, IsCorrect: isCorrect, QuestionID: questionId });
      return res.json(answer);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const answerId = parseInt(id, 10);
      console.log(`Попытка удаления ответа с ID: ${answerId}`);

      const answer = await Answer.findByPk(answerId);
      if (!answer) {
        return next(ApiError.badRequest(`Ответ с ID ${answerId} не найден`));
      }

      // Удаляем связанные записи в UserAnswer
      await UserAnswer.destroy({ where: { AnswerID: answerId } });

      // Удаляем сам ответ
      await answer.destroy();
      console.log(`Ответ с ID ${answerId} успешно удален`);
      return res.json({ message: "Ответ успешно удален" });
    } catch (e) {
      const { id } = req.params;
      console.error(`Ошибка при удалении ответа с ID ${id}: ${e.message}`);
      return next(ApiError.badRequest(`Ошибка при удалении ответа с ID ${id}: ${e.message}`));
    }
  }
}

export default new AnswerController();