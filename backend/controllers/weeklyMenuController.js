import WeeklyMenu from '../models/WeeklyMenu.js';
import MenuItem from '../models/MenuItem.js';

// Get today's menu items
export const getTodayMenu = async (req, res) => {
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  try {
    const menuItems = await WeeklyMenu.findAll({
      where: { day: today },
      include: { model: MenuItem },
    });
    res.status(200).json(menuItems.map(menu => menu.MenuItem));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s menu', error });
  }
};

// Get menu for all days in the week
export const getWeeklyMenu = async (req, res) => {
  try {
    const weeklyMenu = await WeeklyMenu.findAll({
      include: { model: MenuItem },
      order: [['day', 'ASC']],
    });

    // Group by days
    const groupedMenu = weeklyMenu.reduce((acc, item) => {
      const { day, MenuItem } = item;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(MenuItem);
      return acc;
    }, {});

    res.status(200).json(groupedMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly menu', error });
  }
};

// Manage weekly menu (assign, edit, or delete menu items for a specific day)
export const manageWeeklyMenu = async (req, res) => {
  const { day, menuItems } = req.body; // menuItems should include ids of menu items to be added or updated

  try {
    // Clear existing menu for the day (delete all existing items for the day)
    await WeeklyMenu.destroy({ where: { day } });

    // Insert new or updated items
    const weeklyMenu = menuItems.map(menu_item_id => ({
      day,
      menu_item_id,
    }));
    
    // Add new items for the selected day
    await WeeklyMenu.bulkCreate(weeklyMenu);
    res.status(200).json({ message: `Menu updated for ${day}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating weekly menu', error });
  }
};

// Delete a menu item for a specific day
export const deleteMenuItemFromDay = async (req, res) => {
  const { day, menuItemId } = req.params;

  try {
    // Delete the specific item from the weekly menu
    await WeeklyMenu.destroy({ where: { day, menu_item_id: menuItemId } });
    res.status(200).json({ message: `Menu item deleted from ${day}` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
};