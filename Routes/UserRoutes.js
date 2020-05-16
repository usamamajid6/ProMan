const express = require('express')
const app = express()
const User = require('../API/UserAPI');
const Project = require('../API/ProjectAPI');
const Team = require('../API/TeamAPI');

// app.use(express.json());


app.post('/registerUser', async (req, res) => {
    console.log("--------------------");
    console.log(req.body);
    console.log("--------------------");
    
    try {
        const uniqueEmailResult = await User.isEmailUnique(req.body.email);
        if (!uniqueEmailResult) {
            try {
                const result = await User.registerUser(
                    req.body.name,
                    req.body.email,
                    req.body.password,
                    req.body.phone_number
                );
                if (result) {
                    res.json({
                        status: "Success",
                        message: "User Registered Succesfully!",
                        data: result
                    });
                } else {
                    res.json({
                        status: "Failed",
                        message: "Some Problem Occur!",
                        data: result
                    });
                }
            } catch (e) {
                console.log("Problem in /registerUser Router", e);
                res.json({
                    status: "Failed",
                    message: "Some Problem in /registerUser Router!",
                    data: e
                })
            }
        } else {
            res.json({
                status: "Failed",
                message: "Email Already Exists!",
                data: {}
            })
        }

    } catch (e) {
        console.log("Problem in /registerUser Router", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /registerUser Router!",
            data: e
        })
    }
});

app.post('/loginUser', async (req, res) => {
    try {
        const result = await User.loginUser(req.body.email, req.body.password);
        if (result) {
            //Credentials Match
            try {
                const secondResult = await Project.getProjectsByMemberId(result._id);
                if (secondResult) {
                    //Success in getting User Projects
                    try {
                        const thirdResult = await Team.getTeamsByMemberId(result._id);
                        if (thirdResult) {
                            //Success in getting User Teams
                            res.json({
                                status: "Success",
                                message: "User Login Successfully!",
                                data: {
                                    result,
                                    secondResult,
                                    thirdResult
                                }
                            })
                        } else {
                            //Problem in getting User Projects
                            res.json({
                                status: "Failed",
                                message: "Problem in getting User Teams!",
                                data: {
                                    result,
                                    secondResult,
                                    thirdResult
                                }
                            });
                        }

                    } catch (e) {
                        console.log("Problem in /updateUser Route", e);
                        res.json({
                            status: "Failed",
                            message: "Some Problem in /updateUser Router!",
                            data: e
                        })
                    }
                    res.json({
                        status: "Success",
                        message: "User Login Succesfully!",
                        data: result
                    });
                } else {
                    //Problem in getting User Projects
                    res.json({
                        status: "Failed",
                        message: "Problem in getting User Projects!",
                        data: {
                            result,
                            secondResult
                        }
                    });
                }

            } catch (e) {
                console.log("Problem in /loginUser Route", e);
                res.json({
                    status: "Failed",
                    message: "Some Problem in /loginUser Router!",
                    data: e
                })
            }
        } else {
            //Credentials didn't match
            res.json({
                status: "Failed",
                message: "Email OR Password are incorrect!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /loginUser Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /loginUser Router!",
            data: e
        })
    }
});

app.put('/updateUser', async (req, res) => {
    try {
        const result = await User.updateUser(
            req.body._id,
            req.body.name,
            req.body.phone_number
        );
        if (result) {
            //User Updated Successfully
            res.json({
                status: "Success",
                message: "User Updated Succesfully!",
                data: result
            });
        } else {
            //User Updation Unsuccessful
            res.json({
                status: "Failed",
                message: "User Updation Unsuccesful!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /updateUser Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /updateUser Router!",
            data: e
        })
    }
});


//No need
app.get('/getAllUsers', async (req, res) => {
    try {
        const result = await User.getAllUsers();
        if (result) {
            //Geting All Users Successfully
            res.json({
                status: "Success",
                message: "Get All Users Succesfully!",
                data: result
            });
        } else {
            //Geting Users Unsuccessful
            res.json({
                status: "Failed",
                message: "Get All Users Unsuccesful!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /getAllUsers Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /getAllUsers Router!",
            data: e
        })
    }
});


//No need
app.post('/getUser', async (req, res) => {
    try {
        const result = await User.getUser(req.body._id);
        if (result) {
            //Get User Successfully
            res.json({
                status: "Success",
                message: "Get User Succesfully!",
                data: result
            });
        } else {
            //Get User Unsuccessful
            res.json({
                status: "Failed",
                message: "User Not Found!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /getUser Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /getUser Router!",
            data: e
        })
    }
});

//No need
app.post('/addProject', async (req, res) => {
    try {
        const result = await User.addProject(req.body._id, req.body.project_id);
        if (result) {
            //Add Project Successfully
            res.json({
                status: "Success",
                message: "Add Project Succesfully!",
                data: result
            });
        } else {
            //Add Project Unsuccessful
            res.json({
                status: "Failed",
                message: "Adding Project to User Unsuccesful!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /addProject Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /addProject Router!",
            data: e
        })
    }
});


//No need
app.put('/updateTTAES', async (req, res) => {
    try {
        const result = await User.updateTTAES(req.body._id, req.body.efficiency_score);
        if (result) {
            //Total Tasks And Efficiency Score Successfully
            res.json({
                status: "Success",
                message: "Total Tasks And Efficiency Score Succesfully!",
                data: result
            });
        } else {
            //Total Tasks And Efficiency Score Unsuccessful
            res.json({
                status: "Failed",
                message: "Adding Project to User Unsuccesful!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /updateTTAES  updateTotalTasksAndEfficiencyScore Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /updateTTAES  updateTotalTasksAndEfficiencyScore Router!",
            data: e
        })
    }
});

//No need
app.post('/test', async (req, res) => {
    await User.isEmailUnique(req.body.email);
    res.send("/test");
})



module.exports = app;
