// models/VenueFeedback.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Venue from './Venue.js';

const VenueFeedback = sequelize.define(
  'VenueFeedback',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    venue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Venue,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'VenueFeedbacks',
  }
);


export default VenueFeedback;
