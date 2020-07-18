const express = require("express");
const app = express();
const Chat = require("../API/ChatAPI");

app.post("/getChatsByProjectId", async (req, res) => {
  try {
    const result = await Chat.getChatByProjectId(req.body.project_id);
    if (result) {
      //Get Chats Messages Successfully
      res.json({
        status: "Success",
        message: "Get Chat Messages Succesfully!",
        data: result,
      });
    } else {
      //Getting Chats Messages Unsuccessful
      res.json({
        status: "Failed",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getChatsByProejctId Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getChatsByProejctId Router!",
      data: e,
    });
  }
});

module.exports = app;
