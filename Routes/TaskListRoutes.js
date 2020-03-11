const express = require('express')
const app = express()
const TaskList = require('../API/TaskListAPI');

app.post('/createNewTaskList', async(req, res)=> {
    try {
       const result= await TaskList.createNewTaskList(
           req.body.name,
           req.body.project_id
       );
    
       if(result){
           //Success in Creating New TaskList
           res.json({
            status:"Success",
            message:"TaskList Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New TaskList
           res.json({
            status:"Failed",
            message:"Unable to Create the TaskList!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewTaskList Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewTaskList Router!",
            data:e
        })
    }   
});



app.post('/createNewTaskListAndAddToTask', async(req, res)=> {
    try {
        const result= await TaskList.createNewTaskList(
            req.body.name,
            req.body.path,
            req.body.member_id
        );
     
        if(result){
            //Success in Creating New TaskList
            res.json({
             status:"Success",
             message:"TaskList Created Succesfully!",
             data:result
         })
        }else{
            //Failed in Creating New TaskList
            res.json({
             status:"Failed",
             message:"Unable to Create the TaskList!",
             data:result
         })
        }
     } catch (e) {
         console.log("Problem in /createNewTaskList Router",e);
         res.json({
             status:"Failed",
             message:"Some Problem in /createNewTaskList Router!",
             data:e
         })
     }  
});

app.post('/getTaskListById',async(req,res)=>{
    try {
        const result = await TaskList.getTaskListById(req.body._id);
        if(result){
            //Get TaskList Successfully
            res.json({
                status:"Success",
                message:"Get TaskList Succesfully!",
                data:result
            });
        }else{
            //Get TaskList Unsuccessful
            res.json({
                status:"Failed",
                message:"TaskList Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getTaskListById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getTaskListById Router!",
            data:e
        })
    }
});



module.exports=app;
