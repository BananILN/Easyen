import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { TestResult, Test, UserAnswer, Question, Answer, User, Lesson } = models;

class TestResultController {
  async createOrUpdate(req, res, next) {
    try {
      const { TestID, UserID, Score, timeTaken } = req.body;

      const parsedTimeTaken = timeTaken !== undefined ? parseInt(timeTaken) : 0;
      if (isNaN(parsedTimeTaken) || parsedTimeTaken < 0) {
        return next(ApiError.badRequest('timeTaken должен быть неотрицательным целым числом'));
      }

      let testResult = await TestResult.findOne({
        where: { TestID, UserID },
      });

      if (testResult) {
        await testResult.update({
          Score,
          CompletedAt: new Date(),
          timeTaken: parsedTimeTaken,
        });
      } else {
        testResult = await TestResult.create({
          TestID,
          UserID,
          Score,
          timeTaken: parsedTimeTaken,
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
            isCorrect: userAnswers.length > 0 && userAnswers.length === correctAnswers.length && userAnswers.every((ua, idx) => ua === correctAnswers[idx]),
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

  async getStatistics(req, res, next) {
    try {
      const { userId } = req.query; 

      const testResults = await TestResult.findAll({
        where: userId ? { UserID: userId } : {}, 
        include: [
          { model: User },
          {
            model: Test,
            include: [
              {
                model: Question,
                include: [
                  { model: Answer },
                  {
                    model: UserAnswer,
                    where: userId ? { UserID: userId } : {}, 
                    include: [{ model: Answer }],
                    required: false, 
                  },
                ],
              },
              { model: Lesson },
            ],
          },
        ],
      });

      const statistics = testResults.map(result => {
        const detailedResults = result.Test.Questions.map(q => {
          const userAnswers = q.UserAnswers?.length
            ? q.UserAnswers.map(ua => (ua.Answer ? ua.Answer.AnswerText : 'Неизвестный ответ'))
            : [];
          const correctAnswers = q.Answers?.length
            ? q.Answers.filter(a => a.IsCorrect).map(a => a.AnswerText)
            : [];
          const isCorrect = userAnswers.length > 0 && userAnswers.length === correctAnswers.length && userAnswers.every((ua, idx) => ua === correctAnswers[idx]);

          console.log(`Вопрос ${q.QuestionID}:`, {
            userAnswers,
            correctAnswers,
            isCorrect,
          });

          return {
            questionText: q.QuestionText,
            userAnswers,
            correctAnswers,
            isCorrect,
          };
        });

        return {
          ResultID: result.ResultID,
          Score: result.Score,
          CompletedAt: result.CompletedAt,
          TestID: result.TestID,
          UserID: result.UserID,
          username: result.User.username,
          timeTaken: Math.floor(Number(result.timeTaken) || 0), 
          detailedResults,
          LessonID: result.Test.Lesson?.LessonID, 
          lessonTitle: result.Test.Lesson?.title || `Урок ${result.Test.Lesson?.LessonID}`,
        };
      });

      return res.json(statistics);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }
}

export default new TestResultController();