import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import './models/associations.js'; // Import associations
import venueBookingRoutes from './routes/venueBookingRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', venueBookingRoutes); // Venue and table bookings





//Sync database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Database connected successfully.');

    await sequelize.sync({ alter: true }); // Synchronize models and create tables if they don't exist
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
