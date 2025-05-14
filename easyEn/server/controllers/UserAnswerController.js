import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { UserAnswer } = models;

class UserAnswerController {
  async createOrUpdate(req, res, next) {
    try {
      const { UserID, QuestionID, AnswerID, TestID } = req.body;
      let userAnswer = await UserAnswer.findOne({
        where: { UserID, QuestionID, AnswerID, TestID },
      });

      if (userAnswer) {
        await userAnswer.update({});
      } else {
        userAnswer = await UserAnswer.create({ UserID, QuestionID, AnswerID, TestID });
      }

      return res.json(userAnswer);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getByTestAndUser(req, res, next) {
    try {
      const { testId, userId } = req.params;
      const userAnswers = await UserAnswer.findAll({
        where: { TestID: testId, UserID: userId },
      });
      return res.json(userAnswers || []);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  // Новый метод для удаления ответов пользователя для теста и пользователя
  async deleteByTestAndUser(req, res, next) {
    try {
      const { testId, userId } = req.params;
      await UserAnswer.destroy({
        where: { TestID: testId, UserID: userId },
      });
      return res.json({ message: "Ответы пользователя успешно удалены" });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

export default new UserAnswerController();