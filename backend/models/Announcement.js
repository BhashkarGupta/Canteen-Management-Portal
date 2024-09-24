// models/Announcement.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Announcement = sequelize.define(
  'Announcement',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_by: {
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
    tableName: 'Announcements',
  }
);

// Associations
// Announcement.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
// User.hasMany(Announcement, { foreignKey: 'created_by', as: 'announcements' });

export default Announcement;
