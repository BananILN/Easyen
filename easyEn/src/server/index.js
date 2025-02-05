import express from 'express';
import { config } from 'dotenv';
import { sequelize } from './db.js';
import { models } from './models/models.js';

config(); 

const PORT = process.env.PORT || 5000;

const app = express();

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