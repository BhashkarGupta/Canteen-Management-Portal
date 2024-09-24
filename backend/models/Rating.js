// models/Rating.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import MenuItem from './MenuItem.js';

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MenuItem,
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
    rating: {
      type: DataTypes.INTEGER, // 1 to 5
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
    tableName: 'Ratings',
    uniqueKeys: {
      unique_rating: {
        fields: ['menu_item_id', 'user_id'],
      },
    },
  }
);

// Associations
// Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });

// Rating.belongsTo(MenuItem, { foreignKey: 'menu_item_id', as: 'menuItem' });
// MenuItem.hasMany(Rating, { foreignKey: 'menu_item_id', as: 'ratings' });

export default Rating;
