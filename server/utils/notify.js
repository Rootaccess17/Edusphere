const Notification = require("../models/Notification");

async function createNotification(userId, message, link = "") {
  try {
    await Notification.create({ user: userId, message, link });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
}

module.exports = createNotification;