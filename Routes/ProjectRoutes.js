const express = require("express");
const app = express();
const Project = require("../API/ProjectAPI");
const Team = require("../API/TeamAPI");
const User = require("../API/UserAPI");
const TaskList = require("../API/TaskListAPI");
// app.use(express.json());

app.post("/createNewProject", async (req, res) => {
  try {
    const result = await Project.createNewProject(
      req.body.name,
      req.body.start_date,
      req.body.end_date,
      req.body.project_type,
      req.body.leader_id,
      req.body.description,
      req.body.cost
    );
    if (result) {
      //Success in Creating New Project
      const r1 = await TaskList.createNewTaskList(
        "In Progress",
        result._id,
        "All tasks with status of in-progress will appear here!"
      );
      const r2 = await TaskList.createNewTaskList(
        "Pending",
        result._id,
        "All tasks with status of pending will appear here!"
      );
      const r3 = await TaskList.createNewTaskList(
        "Done",
        result._id,
        "All tasks with status of done will appear here!"
      );
      if (!(req.body.team_id === "no-team")) {
        try {
          const secondResult = await Team.addProject(
            req.body.team_id,
            result._id
          );
          if (secondResult) {
            //Success in Adding New Project To Team
            const thirdResult = await Team.getTeamById(req.body.team_id);
            const members = thirdResult.members;
            await Project.addMembers(result._id, members);

            const updatedResult = await Project.getProjectById(result._id);
            res.json({
              status: "Success",
              message: "Project Created Succesfully!",
              data: {
                result: updatedResult,
              },
            });
          } else {
            //Failed in Adding New Project To Team
            res.json({
              status: "Failed",
              message:
                "Project Created Succesfully But Project Not added to Teams!",
              data: {
                result,
                secondResult,
              },
            });
          }
        } catch (e) {
          console.log("Problem in /createNewProject Router", e);
          res.json({
            status: "Failed",
            message: "Some Problem in /createNewProject Router!",
            data: e,
          });
        }
      } else {
        try {
          const r = await Project.addMember(
            parseInt(result._id),
            parseInt(req.body.leader_id)
          );
          const updatedResult = await Project.getProjectById(result._id);
          res.json({
            status: "Success",
            message: "Project Created Succesfully!",
            data: { result: updatedResult },
          });
        } catch (error) {
          console.log("Problem in /createNewProject Router", e);
          res.json({
            status: "Failed",
            message: "Some Problem in /createNewProject Router!",
            data: e,
          });
        }
      }
    } else {
      //Failed in Creating New Project
      res.json({
        status: "Failed",
        message: "Unable to Create the Project!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewProject Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewProject Router!",
      data: e,
    });
  }
});

app.post("/getProjectById", async (req, res) => {
  try {
    const result = await Project.getProjectById(req.body._id);
    if (result) {
      //Get Project Successfully
      const taskList = await TaskList.getTaskListsByProjectId(result._id);
      // result.data.taskList = taskList;
      res.json({
        status: "Success",
        message: "Get Project Succesfully!",
        data: { result, taskList },
      });
    } else {
      //Get Project Unsuccessful
      res.json({
        status: "Failed",
        message: "Project Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getProjectById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getProjectById Router!",
      data: e,
    });
  }
});

app.put("/updateProjectLeader", async (req, res) => {
  try {
    const result = await Project.updateProjectLeader(
      req.body._id,
      req.body.leader_id
    );
    if (result) {
      //Leader Updated Successfully
      try {
        const secondResult = await Project.addMember(
          req.body._id,
          req.body.leader_id
        );
        if (secondResult) {
          //Adding Member to Project Successfully
          res.json({
            status: "Success",
            message: "Leader Updated Succesfully!",
            data: {
              result,
              secondResult,
            },
          });
        } else {
          //Adding Member to Project Unsuccesful

          res.json({
            status: "Failed",
            message: "Some problem occur!",
            data: {
              result,
              secondResult,
            },
          });
        }
      } catch (e) {
        console.log("Problem in /updateLeader Route", e);
        res.json({
          status: "Failed",
          message: "Some Problem in /updateLeader Router!",
          data: e,
        });
      }
    } else {
      //Leader Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateLeader Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateLeader Router!",
      data: e,
    });
  }
});

app.put("/updateProjectStatus", async (req, res) => {
  try {
    const result = await Project.updateProjectStatus(
      req.body._id,
      req.body.status
    );
    if (result) {
      //Project Status Updated Successfully
      res.json({
        status: "Success",
        message: "Project Status Updated Succesfully!",
        data: result,
      });
    } else {
      //Project Status Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateProjectStatus Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateProjectStatus Router!",
      data: e,
    });
  }
});

app.put("/updateProjectType", async (req, res) => {
  try {
    const result = await Project.updateProjectType(
      req.body._id,
      req.body.project_type
    );
    if (result) {
      //Project Type Updated Successfully
      res.json({
        status: "Success",
        message: "Project Type Updated Succesfully!",
        data: result,
      });
    } else {
      //Project Type Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateProjectType Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateProjectType Router!",
      data: e,
    });
  }
});

app.put("/updateProjectCost", async (req, res) => {
  try {
    const result = await Project.updateProjectCost(
      req.body._id,
      req.body.project_cost
    );
    if (result) {
      //Project Cost Updated Successfully
      res.json({
        status: "Success",
        message: "Project Cost Updated Succesfully!",
        data: result,
      });
    } else {
      //Project Cost Updated Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateProjectCost Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateProjectCost Router!",
      data: e,
    });
  }
});

app.put("/addMemberToProject", async (req, res) => {
  try {
    const result = await Project.addMember(req.body._id, req.body.member_id);
    if (result) {
      //Adding member to Project Successfully
      res.json({
        status: "Success",
        message: "Adding member to Project Succesfully!",
        data: result,
      });
    } else {
      //Adding member to Project Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /addMemberToProject Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /addMemberToProject Router!",
      data: e,
    });
  }
});

app.put("/updateTTAESOfMIProject", async (req, res) => {
  try {
    const result = await Project.updateTTAES(
      req.body._id,
      req.body.member_id,
      req.body.efficiency_score
    );
    if (result) {
      //Updation of Total Tasks and Efficiency Score in Project Database Successfully
      try {
        const secondResult = await User.updateTTAES(
          req.body.member_id,
          req.body.efficiency_score
        );
        if (secondResult) {
          //Updation of Total Tasks and Efficiency Score in User AND Project Database Successfully
          res.json({
            status: "Success",
            message:
              "Updation of Total Tasks and Efficiency Score Successfully",
            messageExplain:
              "Updation of Total Tasks and Efficiency Score in User AND Project Database Succesfully!",
            data: { result, secondResult },
          });
        } else {
          //Updation of Total Tasks and Efficiency Score in User Database Successfully
          res.json({
            status: "Failed",
            message: "Some problem occur!",
            data: result,
          });
        }
      } catch (e) {
        console.log("Problem in /updateTTAESOfProject Route", e);
        res.json({
          status: "Failed",
          message: "Some Problem in /updateTTAESOfProject Router!",
          data: e,
        });
      }
    } else {
      //Updation of Total Tasks and Efficiency Score in Project Database Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /updateTTAESOfProject Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /updateTTAESOfProject Router!",
      data: e,
    });
  }
});

app.put("/addMultipleMemberToProject", async (req, res) => {
  try {
    let fullResult = "";
    for (let i = 0; i < req.body.member_id.length; i++) {
      let result = await Project.addMember(req.body._id, req.body.member_id[i]);
      fullResult = JSON.stringify(fullResult) + result;
    }
    if (fullResult) {
      //Adding member to Project Successfully
      res.json({
        status: "Success",
        message: "Adding member to Project Succesfully!",
        data: fullResult,
      });
    } else {
      //Adding member to Project Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: fullResult,
      });
    }
  } catch (e) {
    console.log("Problem in /addMemberToProject Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /addMemberToProject Router!",
      data: e,
    });
  }
});

app.post("/getProjectData", async (req, res) => {
  // Body Parameters
  // _id // Project ID
  // user_id // ID of user who accessing it
  try {
    const result = await Project.getProjectById(req.body._id);

    if (result) {
      //Get Project Successfully
      let taskList = await TaskList.getTaskListsByProjectId(
        result._id,
        req.body.user_id
      );

      result.taskList = taskList;
      res.json({
        status: "Success",
        message: "Get Project Succesfully!",
        data: { result, taskList },
      });
    } else {
      //Get Project Unsuccessful
      res.json({
        status: "Failed",
        message: "Project Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getProjectById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getProjectById Router!",
      data: e,
    });
  }
});

module.exports = app;
