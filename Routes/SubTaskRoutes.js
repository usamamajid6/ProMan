const express = require('express')
const app = express()
const SubTask = require('../API/SubTaskAPI');

app.post('/createNewSubTask', async(req, res)=> {
    try {
       const result= await SubTask.createNewSubTask(
           req.body.name,
           req.body.description,
           req.body.member_id
       );
    
       if(result){
           //Success in Creating New SubTask
           res.json({
            status:"Success",
            message:"SubTask Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New SubTask
           res.json({
            status:"Failed",
            message:"Unable to Create the SubTask!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewSubTask Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewSubTask Router!",
            data:e
        })
    }   
});



app.post('/createNewSubTaskAndAddToTask', async(req, res)=> {
    try {
        const result= await SubTask.createNewSubTask(
            req.body.name,
            req.body.path,
            req.body.member_id
        );
     
        if(result){
            //Success in Creating New SubTask
            res.json({
             status:"Success",
             message:"SubTask Created Succesfully!",
             data:result
         })
        }else{
            //Failed in Creating New SubTask
            res.json({
             status:"Failed",
             message:"Unable to Create the SubTask!",
             data:result
         })
        }
     } catch (e) {
         console.log("Problem in /createNewSubTask Router",e);
         res.json({
             status:"Failed",
             message:"Some Problem in /createNewSubTask Router!",
             data:e
         })
     }  
});

app.post('/getSubTaskById',async(req,res)=>{
    try {
        const result = await SubTask.getSubTaskById(req.body._id);
        if(result){
            //Get SubTask Successfully
            res.json({
                status:"Success",
                message:"Get SubTask Succesfully!",
                data:result
            });
        }else{
            //Get SubTask Unsuccessful
            res.json({
                status:"Failed",
                message:"SubTask Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getSubTaskById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getSubTaskById Router!",
            data:e
        })
    }
});



module.exports=app;
