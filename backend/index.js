import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sequelize, connectDB } from './config/db.js';
import { User, MenuItem, Order, OrderItem, Venue, VenueBooking, InventoryItem, MenuItemIngredient, Announcement, Feedback, Rating, VenueFeedback } from './models/index.js';
import userRoutes from './routes/userRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import venueBookingRoutes from './routes/venueBookingRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import venueFeedbackRoutes from './routes/venueFeedbackRoutes.js';
import { startInventoryCron } from './utils/inventoryCron.js';
import weeklyMenuRoutes from './routes/weeklyMenuRoutes.js';
 

const app = express();
const PORT = process.env.PORT || 2100;

app.use(helmet()); // for securing HTTP Headers

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL for communication
  credentials: true,
}));

// For rate limiting api request from same IP ( prevent brute force upto certain extent)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

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
app.use('/api/users', userRoutes);// User Routes
app.use('/api/menu', menuRoutes);// Menu Routes
app.use('/api/orders', orderRoutes);// Order Routes
app.use('/api/venues', venueRoutes);// Venue Routes
app.use('/api/venue-bookings', venueBookingRoutes);// Venue Booking Routes
app.use('/api/inventory', inventoryRoutes);// Inventory Routes
app.use('/api/recipes', recipeRoutes);// Recipe Routes
app.use('/api/announcements', announcementRoutes);// Announcement Routes
app.use('/api/feedback', feedbackRoutes); // Feedback Routes
app.use('/api/ratings', ratingRoutes); // Rating Routes
app.use('/api/profile', profileRoutes); // Profile Routes
app.use('/api/venue-feedback', venueFeedbackRoutes);// Venue Feedback Routes
app.use('/api/weekly-menu', weeklyMenuRoutes);

// Start inventory cron job
startInventoryCron();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
