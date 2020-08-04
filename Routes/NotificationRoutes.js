const express = require("express");
const app = express();
const Notification = require("../API/NotificationAPI");

app.post("/getNotificationsByMemberId", async (req, res) => {
  try {
    const { member_id, latest_current_notification_id } = req.body;
    const result = await Notification.getNotificationByMemberId(member_id);
    const numberOfUnreadNotifications = await Notification.getUnreadNotificationsNumberByMemberId(
      member_id
    );
    const latestNotifications = await Notification.getNewNotificationsByMemberId(
      member_id,
      latest_current_notification_id
    );
    if (result) {
      //Get Notification(s) Successfully
      res.json({
        status: "Success",
        message: "Get Notification(s) Succesfully!",
        data: {
          notifications: result,
          unread: numberOfUnreadNotifications,
          latest: latestNotifications,
        },
      });
    } else {
      //Getting Notification(s) Unsuccessful
      res.json({
        status: "Failed",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getNotificationByMemberId");
  }
});

app.post("/markNotificationsAsRead", async (req, res) => {
  try {
    const { member_id } = req.body;
    const result = await Notification.markNotificationsAsRead(member_id);
    if (result) {
      //Get Notification(s) Successfully
      res.json({
        status: "Success",
        message: "Mark The Notifications As Read Succesfully!",
        data: result,
      });
    } else {
      //Getting Notification(s) Unsuccessful
      res.json({
        status: "Failed",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /markNotificationsAsRead");
  }
});

module.exports = app;
