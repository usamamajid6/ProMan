const express = require("express");
const app = express();
const Task = require("../API/TaskAPI");
const TaskList = require("../API/TaskListAPI");
const Project = require("../API/ProjectAPI");

app.post("/createNewTask", async (req, res) => {
  try {
    const result = await Task.createNewTask(
      req.body.name,
      req.body.description,
      req.body.pre_req_id,
      req.body.due_date,
      req.body.member_id_array,
      req.body.task_list_id,
      req.body.project_id
    );

    if (result) {
      //Success in Creating New Task
      res.json({
        status: "Success",
        message: "Task Created Succesfully!",
        data: result,
      });
    } else {
      //Failed in Creating New Task
      res.json({
        status: "Failed",
        message: "Unable to Create the Task!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewTask Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewTask Router!",
      data: e,
    });
  }
});

// No need for that
app.post("/createNewTaskAndAddToTaskList", async (req, res) => {
  try {
    const result = await Task.createNewTask(
      req.body.name,
      req.body.path,
      req.body.member_id
    );

    if (result) {
      //Success in Creating New Task
      res.json({
        status: "Success",
        message: "Task Created Succesfully!",
        data: result,
      });
    } else {
      //Failed in Creating New Task
      res.json({
        status: "Failed",
        message: "Unable to Create the Task!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewTask Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewTask Router!",
      data: e,
    });
  }
});

app.post("/getTaskById", async (req, res) => {
  try {
    const result = await Task.getTaskById(req.body._id);
    if (result) {
      //Get Task Successfully
      res.json({
        status: "Success",
        message: "Get Task Succesfully!",
        data: result,
      });
    } else {
      //Get Task Unsuccessful
      res.json({
        status: "Failed",
        message: "Task Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getTaskById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getTaskById Router!",
      data: e,
    });
  }
});

app.put("/updateTaskStatus", async (req, res) => {
  try {
    let result = await Task.updateTaskStatus(
      req.body._id,
      req.body.status,
      req.body.member_id,
      req.body.project_id
    );
    if (result) {
      //Task Status Updated Successfully
      result = await Task.getTaskById(req.body._id);
      res.json({
        status: "Success",
        message: "Task Status Updated Succesfully!",
        data: result,
      });
    } else {
      //Task Status Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateTaskStatus Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateTaskStatus Router!",
      data: e,
    });
  }
});

app.put("/updateTaskStatusLeader", async (req, res) => {
  try {
    let result = await Task.updateTaskStatusLeader(
      req.body._id,
      req.body.status,
      req.body.project_id
    );
    if (result) {
      //Task Status Updated Successfully
      result = await Task.getTaskById(req.body._id);
      res.json({
        status: "Success",
        message: "Task Status Updated Succesfully!",
        data: result,
      });
    } else {
      //Task Status Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateTaskStatusLeader Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateTaskStatusLeader Router!",
      data: e,
    });
  }
});

app.post("/addSubscriberToTask", async (req, res) => {
  try {
    const result = await Task.addSubscriber(
      req.body._id,
      req.body.member_id,
      req.body.project_id
    );
    res.json({
      Status: "Success",
      message: "Successfully Subscribed!",
      data: result,
    });
  } catch (e) {
    res.json({
      Status: "Failed",
      message: "Some Problem Occur!",
      data: result,
    });
    console.log("Problem in /addSubscriberToTask!");
  }
});

app.post("/removeSubscriberToTask", async (req, res) => {
  try {
    const result = await Task.removeSubscriber(
      req.body._id,
      req.body.member_id,
      req.body.project_id
    );
    res.json({
      Status: "Success",
      message: "Successfully Unsubscribed!",
      data: result,
    });
  } catch (e) {
    res.json({
      Status: "Failed",
      message: "Some Problem Occur!",
      data: result,
    });
    console.log("Problem in /removeSubscriberToTask!");
  }
});

app.put("/updateTask", async (req, res) => {
  try {
    let {
      _id,
      name,
      description,
      due_date,
      what_changes,
      project_id,
    } = req.body;
    let result = await Task.updateTask(
      _id,
      name,
      description,
      due_date,
      what_changes,
      project_id
    );
    if (result) {
      //Task Status Updated Successfully
      result = await Task.getTaskById(req.body._id);
      res.json({
        status: "Success",
        message: "Task Updated Succesfully!",
        data: result,
      });
    } else {
      //Task Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateTask Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateTask Router!",
      data: e,
    });
  }
});

app.put("/addMemberToTask", async (req, res) => {
  try {
    let { _id, member_id, project_id } = req.body;
    let result = await Task.addMember(_id, member_id, project_id);
    if (result) {
      //Member added to Task Successfully
      result = await Task.getTaskById(req.body._id);
      res.json({
        status: "Success",
        message: "Member added to Task Successfully!",
        data: result,
      });
    } else {
      //Task Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /addMemberToTask Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /addMemberToTask Router!",
      data: e,
    });
  }
});

module.exports = app;
