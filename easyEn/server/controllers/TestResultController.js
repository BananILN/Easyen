import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { TestResult, Test, UserAnswer, Question, Answer } = models;

class TestResultController {
  async createOrUpdate(req, res, next) {
    try {
      const { TestID, UserID, Score, timeTaken } = req.body;

      let testResult = await TestResult.findOne({
        where: { TestID, UserID },
      });

      if (testResult) {
      
        await testResult.update({
          Score,
          CompletedAt: new Date(),
          timeTaken,
        });
      } else {
       
        testResult = await TestResult.create({
          TestID,
          UserID,
          Score,
          timeTaken,
          CompletedAt: new Date(),
        });
      }

      return res.json(testResult);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const testResults = await TestResult.findAll();
      return res.json(testResults);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const testResult = await TestResult.findByPk(id);
      if (!testResult) {
        return next(ApiError.badRequest('Результат теста не найден'));
      }
      return res.json(testResult);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }

  async getByLessonAndUser(req, res, next) {
    try {
      const { lessonId, userId } = req.params;

      const testResults = await TestResult.findAll({
        include: [
          {
            model: Test,
            where: { LessonID: lessonId },
            include: [
              {
                model: Question,
                include: [
                  { model: Answer },
                  {
                    model: UserAnswer,
                    where: { UserID: userId },
                    include: [{ model: Answer }],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
        where: { UserID: userId },
      });

      const results = testResults.map((result) => {
        const detailedResults = result.Test.Questions.map((q) => {
          const userAnswers = q.UserAnswers?.length
            ? q.UserAnswers.map((ua) => (ua.Answer ? ua.Answer.AnswerText : "Неизвестный ответ"))
            : [];
          const correctAnswers = q.Answers?.length
            ? q.Answers.filter((a) => a.IsCorrect).map((a) => a.AnswerText)
            : [];
          return {
            questionText: q.QuestionText,
            userAnswers,
            correctAnswers,
            isCorrect: userAnswers.length === correctAnswers.length && userAnswers.every((ua, idx) => ua === correctAnswers[idx]),
          };
        });

        return {
          ResultID: result.ResultID,
          Score: result.Score,
          CompletedAt: result.CompletedAt,
          TestID: result.TestID,
          UserID: result.UserID,
          timeTaken: result.timeTaken,
          detailedResults,
        };
      });

      return res.json(results);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }
}

export default new TestResultController();