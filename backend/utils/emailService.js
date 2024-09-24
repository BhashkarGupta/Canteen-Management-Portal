// utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLowInventoryAlert = async (itemName, remainingQuantity) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL, // Email to receive alerts (e.g., admin)
    subject: `Low Inventory Alert: ${itemName}`,
    text: `The inventory for "${itemName}" is low. Only ${remainingQuantity} units left.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Low inventory alert sent for ${itemName}`);
  } catch (error) {
    console.error('Error sending low inventory alert:', error);
  }
};
