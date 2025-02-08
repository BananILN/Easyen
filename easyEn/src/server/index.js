import express from 'express';
import { config } from 'dotenv';
import { sequelize } from './db.js';
import { models } from './models/models.js';
import  cors  from 'cors'
import { router } from './routes/index.js'
import ErrorHandlingMiddleWare from '../server/middleware/ErrorHandlingMiddleWare.js'
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

config(); 

const PORT = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(ErrorHandlingMiddleWare); 

const start = async () => {
  try {
    await sequelize.authenticate(); 
    await sequelize.sync(); 
   

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();