const express = require("express");
const app = express();
const Timeline = require("../API/TimelineAPI");
const Project = require("../API/ProjectAPI");

app.post("/createNewTimeline", async (req, res) => {
  try {
    const result = await Timeline.createNewTimeline(
      req.body.content,
      req.body.type,
      req.body.project_id
    );

    if (result) {
      //Success in Creating New Timeline
      try {
        // const secondResult = await Project.addTimeline(
        //   req.body.project_id,
        //   result._id
        // );
        const secondResult = true;
        if (secondResult) {
          //Success in Adding Timeline To Project
          res.json({
            status: "Success",
            message: "Timeline Created Succesfully!",
            data: {
              result,
              secondResult,
            },
          });
        } else {
          //Failed in Adding Timeline To Project
          res.json({
            status: "Failed",
            message: "Failed in Adding Timeline To Project",
            data: {
              result,
              secondResult,
            },
          });
        }
      } catch (error) {
        console.log("Problem in /createNewTimeline Router", e);
        res.json({
          status: "Failed",
          message: "Some Problem in /createNewTimeline Router!",
          data: e,
        });
      }
    } else {
      //Failed in Creating New Timeline
      res.json({
        status: "Failed",
        message: "Unable to Create the Timeline!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewTimeline Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewTimeline Router!",
      data: e,
    });
  }
});

app.post("/getTimelineById", async (req, res) => {
  try {
    const result = await Timeline.getTimelineById(req.body._id);
    if (result) {
      //Get Timeline Successfully
      res.json({
        status: "Success",
        message: "Get Timeline Succesfully!",
        data: result,
      });
    } else {
      //Get Timeline Unsuccessful
      res.json({
        status: "Failed",
        message: "Timeline Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getTimelineById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getTimelineById Router!",
      data: e,
    });
  }
});

module.exports = app;
