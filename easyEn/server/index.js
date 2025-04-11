import express from 'express';
import { config } from 'dotenv';
import { sequelize } from './db.js';
import { models } from './models/models.js';
import cors from 'cors';
import { router } from './routes/index.js';
import ErrorHandlingMiddleWare from './middleware/ErrorHandlingMiddleWare.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const PORT = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticPath = path.resolve(__dirname, 'static');
console.log("Путь к static:", staticPath);

app.use(cors());
app.use(express.json());
app.use('/static', express.static(staticPath)); 
app.use(fileUpload({}));
app.use('/api', router);

// Перехват всех остальных маршрутов (только после static и api)
// app.get('*', (req, res) => {
//   console.log("Перехват маршрута:", req.originalUrl);
//   res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
// });

app.use(ErrorHandlingMiddleWare);

const start = async () => {
  try {
    console.log('Попытка подключения к базе данных...');
    await sequelize.authenticate();
    console.log('База данных подключена');
    await sequelize.sync();
    console.log('Таблицы синхронизированы');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

start();