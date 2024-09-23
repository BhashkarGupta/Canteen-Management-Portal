import express from 'express';
import { sequelize, connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import {
  User,
  MenuItem,
  Order,
  OrderItem,
} from './models/index.js';

const app = express();
const PORT = process.env.PORT || 2100;

app.use(express.json());

// Connect Database
connectDB();

// Sync the model with the database (auto-create tables)
const syncModels = async () => {
  try {
    // await User.sync({ alter: true });
    await sequelize.sync({ alter: true });
    console.log('Models synced successfully');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
};
syncModels();

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
