// controllers/AdminController.js
import { models } from "../models/models.js";
import ApiError from "../Error/ApiErrors.js";

const { User, Progresses } = models;

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ["UserID", "username", "email", "password", "RoleID", "img"], // Убедимся, что img включён
      });
      return res.json(users);
    } catch (e) {
      return next(ApiError.internal("Ошибка получения пользователей: " + e.message));
    }
  }

  // Новый метод для получения данных одного пользователя
  async getUserById(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId, {
        attributes: ["UserID", "username", "email", "password", "RoleID", "img", "about", "gender", "theme", "language"], // Включаем все нужные поля
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (e) {
      return next(ApiError.internal("Ошибка получения пользователя: " + e.message));
    }
  }

  async getProgressForUser(req, res, next) {
    const { userId } = req.params;
    try {
      console.log(`Fetching progress for userId: ${userId}`);
      const progress = await Progresses.findAll({
        where: { UserID: userId },
        include: [
          { model: models.Lesson, attributes: ["LessonID", "title"] },
        ],
      });
      if (!progress || progress.length === 0) {
        console.log(`No progress found for userId: ${userId}`);
        return res.json([]);
      }
      console.log(`Progress fetched for userId ${userId}:`, progress);
      return res.json(progress);
    } catch (e) {
      console.error(`Error fetching progress for userId ${userId}:`, e);
      return next(ApiError.internal("Ошибка получения прогресса: " + e.message));
    }
  }

  async deleteUser(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.destroy();
      console.log(`User ${userId} deleted successfully`);
      return res.json({ message: "User deleted successfully" });
    } catch (e) {
      console.error(`Error deleting user ${userId}:`, e);
      return next(ApiError.internal("Ошибка удаления пользователя: " + e.message));
    }
  }
}

export default new AdminController();