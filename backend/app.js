import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// User Routes
app.use('/api/users', userRoutes);

//Sync database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Database connected successfully.');

    await sequelize.sync(); // Synchronize models and create tables if they don't exist
    console.log('Tables synchronized.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
