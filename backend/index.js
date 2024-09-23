import express from 'express';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 2100;

app.use(express.json());

// Connect Database
connectDB();

// Sync the model with the database (auto-create tables)
const syncModels = async () => {
  try {
    await User.sync({ alter: true });
    console.log('Users table created or updated');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
};
syncModels();

// Use Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
