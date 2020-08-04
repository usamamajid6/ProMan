const ChatAPI = require("./API/ChatAPI.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.emit("fromServer", { data: "s" });

    socket.on("joinTheProjectRoom", (data) => {
      const room_name = "roomForProject#" + data._id;
      socket.join(room_name);
    });

    // Project Room Leaving
    socket.on("leaveTheProjectRoom", (data) => {
      const room_name = "roomForProject#" + data._id;
      socket.leave(room_name);
    });
    // For updating Project Data
    socket.on("tellRoomMatesToUpdateProject", (data) => {
      const room_name = "roomForProject#" + data._id;
      io.to(room_name).emit("updateProjectData");
    });

    // Task Room
    socket.on("joinTheTaskRoom", (data) => {
      const room_name = "roomForTask#" + data._id;

      socket.join(room_name);
    });
    socket.on("leaveTheTaskRoom", (data) => {
      const room_name = "roomForTask#" + data._id;

      socket.leave(room_name);
    });
    socket.on("tellRoomMatesToUpdateTask", (data) => {
      const room_name = "roomForTask#" + data._id;
      io.to(room_name).emit("updateTaskData");
    });

    // Add Chat
    socket.on("addChatMessageToProject", async (data) => {
      const room_name = "roomForProject#" + data.project_id;
      const result = await ChatAPI.createNewChat(
        data.message,
        data.member_id,
        data.project_id
      );
      io.to(room_name).emit("updateChatsData", result);
    });
    socket.on("disconnect", () => console.log("Client disconnected"));
  });
};
