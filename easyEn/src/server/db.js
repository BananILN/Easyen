import { Sequelize } from 'sequelize';
import { config } from 'dotenv'; 

config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Название базы данных
  process.env.DB_USER, // Имя пользователя
  process.env.DB_PASSWORD, // Пароль
  {
    dialect: 'postgres', // Используемая СУБД
    host: process.env.DB_HOST, // Хост
    port: process.env.DB_PORT, // Порт
  }
);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

export { sequelize }; 