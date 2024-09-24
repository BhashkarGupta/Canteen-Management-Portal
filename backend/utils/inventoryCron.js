// utils/inventoryCron.js
import cron from 'node-cron';
import { Op } from 'sequelize';
import InventoryItem from '../models/InventoryItem.js';
import { sendLowInventoryAlert } from './emailService.js';
import { sequelize } from '../config/db.js';

export const startInventoryCron = () => {
  // Schedule to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const lowInventoryItems = await InventoryItem.findAll({
        where: {
          quantity: { [Op.lt]: sequelize.col('threshold') },
        },
      });

      for (const item of lowInventoryItems) {
        await sendLowInventoryAlert(item.item_name, item.quantity);
      }

      console.log('Low inventory alert check completed.');
    } catch (error) {
      console.error('Error in inventory cron job:', error);
    }
  });
};
