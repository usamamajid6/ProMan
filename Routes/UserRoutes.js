const express = require('express')
const app = express()
const User = require('../API/UserAPI');
app.use(express.json());

app.post('/registerUser', async(req, res)=> {
    try {
        const uniqueEmailResult=await User.isEmailUnique(req.body.email);
        if(!uniqueEmailResult){
            try {
                const result=await User.registerUser(req.body.name,req.body.email,req.body.password);
            if(result){
                res.json({
                    status:"Success",
                    message:"User Registered Succesfully!",
                    data:result
                });
            }else{
                res.json({
                    status:"Failed",
                    message:"Some Problem Occur!",
                    data:result
                });
            }
            } catch (e) {
                console.log("Problem in /registerUser Router",e);
                res.json({
                    status:"Failed",
                    message:"Some Problem in /registerUser Router!",
                    data:e
                })
            }
        }else{
            res.json({
                status:"Failed",
                message:"Email Already Exists!",
                data:{}
            })
        }
        
    } catch (e) {
        console.log("Problem in /registerUser Router",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /registerUser Router!",
            data:e
        })
    }   
});

app.post('/loginUser',async (req,res)=>{
    try {
        const result= await User.loginUser(req.body.email,req.body.password);
        if(result){
            //Credentials Match
            res.json({
                status:"Success",
                message:"User Login Succesfully!",
                data:result
            });
        }else{
            //Credentials didn't match
            res.json({
                status:"Failed",
                message:"Email OR Password are incorrect!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /loginUser Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /loginUser Router!",
            data:e
        })
    }
});

app.put('/updateUser',async(req,res)=>{
    try {
        const result=await User.updateUser(req.body._id,req.body.name);
        if(result){
            //User Updated Successfully
            res.json({
                status:"Success",
                message:"User Updated Succesfully!",
                data:result
            });
        }else{
            //User Updation Unsuccessful
            res.json({
                status:"Failed",
                message:"User Updation Unsuccesful!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /updateUser Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /updateUser Router!",
            data:e
        })
    }
});

app.get('/getAllUsers',async(req,res)=>{
    try {
        const result=await User.getAllUsers();
        if(result){
            //Geting All Users Successfully
            res.json({
                status:"Success",
                message:"Get All Users Succesfully!",
                data:result
            });
        }else{
            //Geting Users Unsuccessful
            res.json({
                status:"Failed",
                message:"Get All Users Unsuccesful!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getAllUsers Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getAllUsers Router!",
            data:e
        })
    }
});

app.post('/getUser',async(req,res)=>{
    try {
        const result = await User.getUser(req.body._id);
        if(result){
            //Get User Successfully
            res.json({
                status:"Success",
                message:"Get User Succesfully!",
                data:result
            });
        }else{
            //Get User Unsuccessful
            res.json({
                status:"Failed",
                message:"User Not Found!",
                data:result
            });
        }
    } catch (e) {
        console.log("Problem in /getUser Route",e);
        res.json({
            status:"Failed",
            message:"Some Problem in /getUser Router!",
            data:e
        })
    }
});

app.post('/test',async(req,res)=>{
    await User.isEmailUnique(req.body.email);
    res.send("/test");
})

module.exports=app;
