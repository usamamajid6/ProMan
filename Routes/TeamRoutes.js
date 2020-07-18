const express = require("express");
const app = express();
const Team = require("../API/TeamAPI");

app.post("/createNewTeam", async (req, res) => {
  try {
    const result = await Team.createNewTeam(
      req.body.name,
      req.body.description,
      req.body.leader_id
    );

    if (result) {
      //Success in Creating New Team
      await Team.addMember(result._id, req.body.leader_id);
      res.json({
        status: "Success",
        message: "Team Created Succesfully!",
        data: result,
      });
    } else {
      //Failed in Creating New Team
      res.json({
        status: "Failed",
        message: "Unable to Create the Team!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewTeam Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewTeam Router!",
      data: e,
    });
  }
});

app.post("/getTeamById", async (req, res) => {
  try {
    const result = await Team.getTeamById(req.body._id);
    if (result) {
      //Get Team Successfully
      res.json({
        status: "Success",
        message: "Get Team Succesfully!",
        data: result,
      });
    } else {
      //Get Team Unsuccessful
      res.json({
        status: "Failed",
        message: "Team Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getTeamById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getTeamById Router!",
      data: e,
    });
  }
});

app.put("/addMultipleMemberToTeam", async (req, res) => {
  try {
    let result = await Team.addMembers(req.body._id, req.body.member_id_array);
    if (result) {

      res.json({
        status: "Success",
        message: "Adding member to Team Succesfully!",
        data: result,
      });
    } else {
      //Adding member to Team Unsuccessful
      res.json({
        status: "Failed",
        message: "Some problem occur!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /addMultipleMemberToTeam Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /addMultipleMemberToTeam Router!",
      data: e,
    });
  }
});

module.exports = app;
