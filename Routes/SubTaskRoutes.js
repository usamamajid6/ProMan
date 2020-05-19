const express = require('express')
const app = express()
const SubTask = require('../API/SubTaskAPI');
const Task = require('../API/TaskAPI');

app.post('/createNewSubTask', async (req, res) => {
    try {
        const result = await SubTask.createNewSubTask(
            req.body.name,
            req.body.description,
            req.body.member_id
        );

        if (result) {
            //Success in Creating New SubTask
            const secondResult = await Task.addSubTask(req.body.task_id, result._id);
            try {
                if (secondResult) {
                    //Success in Adding SubTask To Task
                    res.json({
                        status: "Success",
                        message: "SubTask Created Succesfully!",
                        data: {
                            result,
                            secondResult
                        }
                    });
                } else {
                    //Unsuccess in Adding SubTask To Task
                    res.json({
                        status: "Failed",
                        message: "SubTask Created Succesfully but SubTask Not Added to Task!",
                        data: {
                            result,
                            secondResult
                        }
                    });
                }
            } catch (e) {
                //Failed in Creating New SubTask
                console.log("Problem in /createNewSubTask Router", e);
                res.json({
                    status: "Failed",
                    message: "Some Problem in /createNewSubTask Router!",
                    data: e
                });
            }

        } else {
            //Failed in Creating New SubTask
            res.json({
                status: "Failed",
                message: "Unable to Create the SubTask!",
                data: result
            })
        }
    } catch (e) {
        console.log("Problem in /createNewSubTask Router", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /createNewSubTask Router!",
            data: e
        })
    }
});



// app.post('/createNewSubTaskAndAddToTask', async(req, res)=> {
//     try {
//         const result= await SubTask.createNewSubTask(
//             req.body.name,
//             req.body.path,
//             req.body.member_id
//         );

//         if(result){
//             //Success in Creating New SubTask
//             res.json({
//              status:"Success",
//              message:"SubTask Created Succesfully!",
//              data:result
//          })
//         }else{
//             //Failed in Creating New SubTask
//             res.json({
//              status:"Failed",
//              message:"Unable to Create the SubTask!",
//              data:result
//          })
//         }
//      } catch (e) {
//          console.log("Problem in /createNewSubTask Router",e);
//          res.json({
//              status:"Failed",
//              message:"Some Problem in /createNewSubTask Router!",
//              data:e
//          })
//      }  
// });

app.post('/getSubTaskById', async (req, res) => {
    try {
        const result = await SubTask.getSubTaskById(req.body._id);
        if (result) {
            //Get SubTask Successfully
            res.json({
                status: "Success",
                message: "Get SubTask Succesfully!",
                data: result
            });
        } else {
            //Get SubTask Unsuccessful
            res.json({
                status: "Failed",
                message: "SubTask Not Found!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /getSubTaskById Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /getSubTaskById Router!",
            data: e
        })
    }
});

app.put('/updateSubTaskStatus', async (req, res) => {
    try {
        const result = await SubTask.updateSubTaskStatus(req.body._id, req.body.status);
        if (result) {
            //SubTask Status Updated Successfully
            res.json({
                status: "Success",
                message: "SubTask Status Updated Succesfully!",
                data: result
            });
        } else {
            //SubTask Status Updated Unsuccessful
            res.json({
                status: "Failed",
                message: "Some problem occur!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /updateSubTaskStatus Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /updateSubTaskStatus Router!",
            data: e
        })
    }
});

module.exports = app;
