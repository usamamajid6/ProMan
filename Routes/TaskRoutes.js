const express = require('express')
const app = express()
const Task = require('../API/TaskAPI');

app.post('/createNewTask', async(req, res)=> {
    try {
       const result= await Task.createNewTask(
           req.body.name,
           req.body.description,
           req.body.pre_req_id,
           req.body.due_date,
           req.body.member_id_array
       );
    
       if(result){
           //Success in Creating New Task
           res.json({
            status:"Success",
            message:"Task Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New Task
           res.json({
            status:"Failed",
            message:"Unable to Create the Task!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewTask Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewTask Router!",
            data:e
        })
    }   
});


// No need for that
app.post('/createNewTaskAndAddToTaskList', async(req, res)=> {
    try {
        const result= await Task.createNewTask(
            req.body.name,
            req.body.path,
            req.body.member_id
        );
     
        if(result){
            //Success in Creating New Task
            res.json({
             status:"Success",
             message:"Task Created Succesfully!",
             data:result
         })
        }else{
            //Failed in Creating New Task
            res.json({
             status:"Failed",
             message:"Unable to Create the Task!",
             data:result
         })
        }
     } catch (e) {
         console.log("Problem in /createNewTask Router",e);
         res.json({
             status:"Failed",
             message:"Some Problem in /createNewTask Router!",
             data:e
         })
     }  
});

app.post('/getTaskById',async(req,res)=>{
    try {
        const result = await Task.getTaskById(req.body._id);
        if(result){
            //Get Task Successfully
            res.json({
                status:"Success",
                message:"Get Task Succesfully!",
                data:result
            });
        }else{
            //Get Task Unsuccessful
            res.json({
                status:"Failed",
                message:"Task Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getTaskById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getTaskById Router!",
            data:e
        })
    }
});

app.put('/updateTaskStatus',async(req,res)=>{
    try {
        const result = await Task.updateTaskStatus(req.body._id,req.body.status);
        if(result){
            //Task Status Updated Successfully
            res.json({
                status:"Success",
                message:"Task Status Updated Succesfully!",
                data:result
            });
        }else{
            //Task Status Updated Unsuccessful
            res.json({
                status:"Failed",
                message:"Some problem occur!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateTaskStatus Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateTaskStatus Router!",
            data:e
        })
    }
});


module.exports=app;
