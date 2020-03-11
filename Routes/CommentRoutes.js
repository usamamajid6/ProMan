const express = require('express')
const app = express()
const Comment = require('../API/CommentAPI');

app.post('/createNewComment', async(req, res)=> {
    try {
       const result= await Comment.createNewComment(
           req.body.message,
           req.body.member_id
       );
    
       if(result){
           //Success in Creating New Comment
           res.json({
            status:"Success",
            message:"Comment Created Succesfully!",
            data:result
        })
       }else{
           //Failed in Creating New Comment
           res.json({
            status:"Failed",
            message:"Unable to Create the Comment!",
            data:result
        })
       }
    } catch (e) {
        console.log("Problem in /createNewComment Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /createNewComment Router!",
            data:e
        })
    }   
});



app.post('/createNewCommentAndAddToTask', async(req, res)=> {
    try {
        const result= await Comment.createNewComment(
            req.body.name,
            req.body.path,
            req.body.member_id
        );
     
        if(result){
            //Success in Creating New Comment
            res.json({
             status:"Success",
             message:"Comment Created Succesfully!",
             data:result
         })
        }else{
            //Failed in Creating New Comment
            res.json({
             status:"Failed",
             message:"Unable to Create the Comment!",
             data:result
         })
        }
     } catch (e) {
         console.log("Problem in /createNewComment Router",e);
         res.json({
             status:"Failed",
             message:"Some Problem in /createNewComment Router!",
             data:e
         })
     }  
});

app.post('/getCommentById',async(req,res)=>{
    try {
        const result = await Comment.getCommentById(req.body._id);
        if(result){
            //Get Comment Successfully
            res.json({
                status:"Success",
                message:"Get Comment Succesfully!",
                data:result
            });
        }else{
            //Get Comment Unsuccessful
            res.json({
                status:"Failed",
                message:"Comment Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getCommentById Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getCommentById Router!",
            data:e
        })
    }
});



module.exports=app;
