// Database connection configuration
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name
  process.env.DB_USER,  // Database username
  process.env.DB_PASS,  // Database password
  {
    host: process.env.DB_HOST,   // Database host
    dialect: 'mysql',
    logging: console.log,  // Optional: Log SQL queries for debugging
  }
);

export { sequelize };