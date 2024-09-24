import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import MenuItem from './MenuItem.js';

const WeeklyMenu = sequelize.define('WeeklyMenu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false,
  },
  menu_item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MenuItem,
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

// Associations
WeeklyMenu.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

export default WeeklyMenu;
