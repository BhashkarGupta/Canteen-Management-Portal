// models/VenueBooking.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VenueBooking = sequelize.define(
  'VenueBooking',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    admin_comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: 'Venue_Bookings',
  }
);

export default VenueBooking;
