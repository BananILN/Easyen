import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';

const { Progresses } = models;

class ProgressController {
  async create(req, res, next) {
    try {
      const { UserID, LessonID, TestID, completed } = req.body;
      if (!UserID || !LessonID || !TestID) {
        return next(ApiError.badRequest("Missing required fields: UserID, LessonID, TestID"));
      }

      const progress = await Progresses.findOne({
        where: { UserID, LessonID, TestID },
      });

      if (progress) {
        await progress.update({ completed, CompletedAt: completed ? new Date() : null });
        return res.json(progress);
      }

      const newProgress = await Progresses.create({
        UserID,
        LessonID,
        TestID,
        completed,
        CompletedAt: completed ? new Date() : null,
      });
      return res.json(newProgress);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const progresses = await Progresses.findAll();
      return res.json(progresses);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getByUserAndLesson(req, res, next) {
    try {
      const { userId, lessonId } = req.params;
      const progresses = await Progresses.findAll({
        where: {
          UserID: userId,
          LessonID: lessonId,
        },
      });
      return res.json(progresses || []);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

export default new ProgressController();