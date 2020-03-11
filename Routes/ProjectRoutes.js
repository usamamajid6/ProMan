const express = require('express')
const app = express()
const Project = require('../API/ProjectAPI');
// app.use(express.json());

app.post('/createNewProject', async(req, res)=> {
    try {
       const result= await Project.createNewProject(
           req.body.name,
           req.body.start_date,
           req.body.end_date,
           req.body.project_type,
           req.body.leader_id,
           req.body.status
       );
       if(result){
           //Success in Creating New Project
           res.json({
            status:"Success",
            message:"Project Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New Project
           res.json({
            status:"Failed",
            message:"Unable to Create the Project!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewProject Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewProject Router!",
            data:e
        })
    }   
});

app.post('/getProjectById',async(req,res)=>{
    try {
        const result = await Project.getProjectById(req.body._id);
        if(result){
            //Get Project Successfully
            res.json({
                status:"Success",
                message:"Get Project Succesfully!",
                data:result
            });
        }else{
            //Get Project Unsuccessful
            res.json({
                status:"Failed",
                message:"Project Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getProjectById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getProjectById Router!",
            data:e
        })
    }
});


app.put('/updateProjectLeader',async(req,res)=>{
    try {
        const result = await Project.updateProjectLeader(req.body._id,req.body.leader_id);
        if(result){
            //Leader Updated Successfully
            res.json({
                status:"Success",
                message:"Leader Updated Succesfully!",
                data:result
            });
        }else{
            //Leader Updated Unsuccessful
            res.json({
                status:"Failed",
                message:"Some problem occur!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateLeader Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateLeader Router!",
            data:e
        })
    }
});

app.put('/updateProjectStatus',async(req,res)=>{
    try {
        const result = await Project.updateProjectStatus(req.body._id,req.body.status);
        if(result){
            //Project Status Updated Successfully
            res.json({
                status:"Success",
                message:"Project Status Updated Succesfully!",
                data:result
            });
        }else{
            //Project Status Updated Unsuccessful
            res.json({
                status:"Failed",
                message:"Some problem occur!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateProjectStatus Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateProjectStatus Router!",
            data:e
        })
    }
});


app.put('/updateProjectType',async(req,res)=>{
    try {
        const result = await Project.updateProjectType(req.body._id,req.body.project_type);
        if(result){
            //Project Type Updated Successfully
            res.json({
                status:"Success",
                message:"Project Type Updated Succesfully!",
                data:result
            });
        }else{
            //Project Type Updated Unsuccessful
            res.json({
                status:"Failed",
                message:"Some problem occur!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateProjectType Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateProjectType Router!",
            data:e
        })
    }
});

app.put('/updateProjectCost',async(req,res)=>{
    try {
        const result = await Project.updateProjectCost(req.body._id,req.body.project_cost);
        if(result){
            //Project Cost Updated Successfully
            res.json({
                status:"Success",
                message:"Project Cost Updated Succesfully!",
                data:result
            });
        }else{
            //Project Cost Updated Unsuccessful
            res.json({
                status:"Failed",
                message:"Some problem occur!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateProjectStatus Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateProjectStatus Router!",
            data:e
        })
    }
});





module.exports=app;
