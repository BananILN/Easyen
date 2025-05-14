import { sequelize } from './db.js';
import { models } from './models/models.js';

const { Test } = models;

const updateTestOrders = async () => {
  try {
    await sequelize.authenticate();
    console.log('База данных подключена');

   
    await Test.update({ order: 1 }, { where: { TestID: 1 } });
    await Test.update({ order: 2 }, { where: { TestID: 2 } });
 

    console.log('Порядок тестов обновлён');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await sequelize.close();
  }
};

updateTestOrders();