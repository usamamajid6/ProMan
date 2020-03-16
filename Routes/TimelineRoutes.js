const express = require('express')
const app = express()
const Timeline = require('../API/TimelineAPI');

app.post('/createNewTimeline', async(req, res)=> {
    try {
       const result= await Timeline.createNewTimeline(
           req.body.content
       );
    
       if(result){
           //Success in Creating New Timeline
           res.json({
            status:"Success",
            message:"Timeline Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New Timeline
           res.json({
            status:"Failed",
            message:"Unable to Create the Timeline!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewTimeline Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewTimeline Router!",
            data:e
        })
    }   
});


app.post('/getTimelineById',async(req,res)=>{
    try {
        const result = await Timeline.getTimelineById(req.body._id);
        if(result){
            //Get Timeline Successfully
            res.json({
                status:"Success",
                message:"Get Timeline Succesfully!",
                data:result
            });
        }else{
            //Get Timeline Unsuccessful
            res.json({
                status:"Failed",
                message:"Timeline Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getTimelineById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getTimelineById Router!",
            data:e
        })
    }
});



module.exports=app;
