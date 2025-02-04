import express from 'express';
import { config } from 'dotenv';
import { sequelize } from './db.js';

config(); // Загружаем переменные окружения

const PORT = process.env.PORT || 5000;

const app = express();

const start = async () => {
  try {
    await sequelize.authenticate(); // Проверка подключения к базе данных
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync(); // Синхронизация моделей с базой данных
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();