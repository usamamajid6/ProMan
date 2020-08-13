const Notification = require("../Schemas/NotificationSchema");
const getLastId = async () => {
  try {
    const result = await Notification.find().sort({ _id: -1 }).limit(1);
    if (result.length === 0) {
      return 0;
    } else {
      return result[0]._id;
    }
  } catch (e) {
    console.log("Error while getting last Last ID.", e);
    return e;
  }
};

const createNewNotification = async (name, description, member_id, p) => {
  try {
    let n = 1;
    let _id = await getLastId();
    _id = parseInt(_id);
    ++_id;
    const notification = new Notification({
      _id,
      name,
      description,
      member: parseInt(member_id),
    });
    try {
      const result = await Notification.create(notification);
      return result;
    } catch (e) {
      console.log("Problem in Creating New Notification.", e);
      return e;
    }
  } catch (e) {
    console.log("Problem in Getting Last Id for New Notification.", e);
    return e;
  }
};

const getNotificationByMemberId = async (member_id) => {
  try {
    const notifications = await Notification.find({
      member: member_id,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    return notifications;
  } catch (e) {
    console.log("Problem in getNotificationByMemberId.", e);
    return e;
  }
};

const getUnreadNotificationsNumberByMemberId = async (member_id) => {
  try {
    const notifications = await Notification.find({
      member: member_id,
      isRead: false,
    });
    return notifications.length;
  } catch (e) {
    console.log("Problem in getNotificationByMemberId.", e);
    return e;
  }
};

const getNewNotificationsByMemberId = async (
  member_id,
  latest_current_notification_id
) => {
  try {
    if (latest_current_notification_id === 0) {
      return [];
    }
    const notifications = await Notification.find({
      member: parseInt(member_id),
      _id: { $gt: parseInt(latest_current_notification_id) },
    }).sort({ createdAt: -1 });
    return notifications;
  } catch (e) {
    console.log("Problem in getNewNotificationsByMemberId.", e);
    return e;
  }
};

const markNotificationsAsRead = async (member_id) => {
  try {
    const notifications = await Notification.updateMany(
      {
        member: member_id,
      },
      { isRead: true }
    );
    return notifications;
  } catch (e) {
    console.log("Problem in markNotificationsAsRead.", e);
    return e;
  }
};
module.exports = {
  createNewNotification,
  getNotificationByMemberId,
  getUnreadNotificationsNumberByMemberId,
  getNewNotificationsByMemberId,
  markNotificationsAsRead,
};
