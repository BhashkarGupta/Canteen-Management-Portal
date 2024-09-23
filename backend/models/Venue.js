// models/Venue.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Venue = sequelize.define(
  'Venue',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    venue_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: 'Venues',
  }
);

export default Venue;
