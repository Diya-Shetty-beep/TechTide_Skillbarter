const User = require('../models/User');

class NotificationService {
  // Send match notification
  static async sendMatchNotification(match, initiator) {
    try {
      const receiverId = match.user1.toString() === initiator._id.toString() ? match.user2 : match.user1;
      const receiver = await User.findById(receiverId);
      
      // In a real app, you would send push notifications, emails, etc.
      console.log(`Match notification sent to ${receiver.name}`);
      
      return true;
    } catch (error) {
      console.error('Error sending match notification:', error);
      return false;
    }
  }

  // Send session reminder
  static async sendSessionReminder(session, participants) {
    try {
      // Implementation for session reminders
      console.log(`Session reminders sent to ${participants.length} users`);
      return true;
    } catch (error) {
      console.error('Error sending session reminder:', error);
      return false;
    }
  }

  // Send skill points notification
  static async sendPointsNotification(userId, points, reason) {
    try {
      const user = await User.findById(userId);
      console.log(`Points notification: ${user.name} earned ${points} points for ${reason}`);
      return true;
    } catch (error) {
      console.error('Error sending points notification:', error);
      return false;
    }
  }
}

module.exports = NotificationService;