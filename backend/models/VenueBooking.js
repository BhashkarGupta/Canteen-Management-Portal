// VenueBooking model
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const VenueBooking = sequelize.define('VenueBooking', {
  bookingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bookingTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  reservationStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reservationEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
});

// Relationships
VenueBooking.belongsTo(User); // Each booking is made by a user

export default VenueBooking;
