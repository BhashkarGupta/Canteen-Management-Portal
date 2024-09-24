// models/Feedback.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Feedback = sequelize.define(
  'Feedback',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'Feedbacks',
  }
);

// Associations
// Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedbacks' });

export default Feedback;
