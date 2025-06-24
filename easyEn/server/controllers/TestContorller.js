import { models } from '../models/models.js';
import ApiError from '../Error/ApiErrors.js';
import { Op } from 'sequelize';
import { sequelize } from '../db.js';

const { Test, Lesson, Question, UserAnswer, TestResult, Progresses } = models;

class TestController {
  async create(req, res, next) {
    try {
      const { title, LessonID, testType, order } = req.body;

      if (!['regular', 'classic', 'trueFalse'].includes(testType)) {
        return next(ApiError.badRequest('Неверный тип теста. Допустимые значения: regular, classic, trueFalse'));
      }

      const lesson = await Lesson.findByPk(LessonID);
      if (!lesson) {
        return next(ApiError.badRequest('Урок не найден'));
      }

      if (order) {
        const existingTest = await Test.findOne({
          where: { LessonID, order },
        });
        if (existingTest) {
          await Test.update(
            { order: sequelize.literal('`order` + 1') },
            { where: { LessonID, order: { [Op.gte]: order } } }
          );
        }
      }

      const test = await Test.create({
        title,
        LessonID,
        testType,
        order: order || 1,
      });
      return res.json(test);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const { LessonID } = req.query;
    const tests = await Test.findAll({
      where: LessonID ? { LessonID } : {},
      include: [{ model: Lesson, attributes: ['LessonID', 'title', 'sections'] }],
      order: [['order', 'ASC']],
    });
    return res.json(tests);
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    const test = await Test.findByPk(id, {
      include: [{ model: Lesson, attributes: ['LessonID', 'title', 'sections'] }],
    });
    if (!test) {
      return next(ApiError.badRequest("Тест не найден"));
    }
    return res.json(test);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, LessonID, testType, order } = req.body;

      const test = await Test.findByPk(id);
      if (!test) {
        return next(ApiError.badRequest("Тест не найден"));
      }

      if (!['regular', 'classic', 'trueFalse'].includes(testType)) {
        return next(ApiError.badRequest('Неверный тип теста. Допустимые значения: regular, classic, trueFalse'));
      }

      let validLessonId = LessonID || test.LessonID;
      if (LessonID) {
        const lesson = await Lesson.findByPk(LessonID);
        if (!lesson) {
          console.warn(`Lesson with ID ${LessonID} not found, using existing LessonID ${test.LessonID}`);
          validLessonId = test.LessonID;
        }
      }

      if (order && order !== test.order) {
        const existingTest = await Test.findOne({
          where: { LessonID: validLessonId, order, TestID: { [Op.ne]: id } },
        });
        if (existingTest) {
          await Test.update(
            { order: sequelize.literal('`order` + 1') },
            { where: { LessonID: validLessonId, order: { [Op.gte]: order }, TestID: { [Op.ne]: id } } }
          );
        }
      }

      await test.update({ title, LessonID: validLessonId, testType, order: order || test.order });
      return res.json(test);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    const testId = parseInt(id, 10);
    console.log(`Попытка удаления теста с ID: ${testId}`);

    try {
      const test = await Test.findByPk(testId);
      if (!test) {
        throw new Error("Тест не найден");
      }

      // Удаляем связанные данные
      await UserAnswer.destroy({ where: { TestID: testId } });
      await TestResult.destroy({ where: { TestID: testId } });
      await Progresses.destroy({ where: { TestID: testId } });
      await Question.destroy({ where: { TestID: testId } });

      // Сдвигаем порядок оставшихся тестов
      await Test.update(
        { order: sequelize.literal('"order" - 1'), updatedAt: new Date() }, // Экранирование имени столбца
        { where: { LessonID: test.LessonID, order: { [Op.gt]: test.order } } }
      );

      // Удаляем тест
      await test.destroy();

      console.log(`Тест с ID ${testId} успешно удален`);
      return res.json({ message: "Тест успешно удален" });
    } catch (e) {
      const errorMessage = `Ошибка при удалении теста с ID ${id}: ${e.message}`;
      console.error(errorMessage);
      return next(ApiError.badRequest(errorMessage));
    }
  }
}

export default new TestController();