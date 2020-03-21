const express = require('express')
const app = express()
const Attachment = require('../API/AttachmentAPI');
const Task = require('../API/TaskAPI');


//This route create a new attachment and add this attachment_id to attachments field in Task
app.post('/createNewAttachment', async (req, res) => {
    try {
        const result = await Attachment.createNewAttachment(
            req.body.name,
            req.body.path,
            req.body.member_id
        );

        if (result) {
            //Success in Creating New Attachment
            try {
                const secondResult = await Task.addAttachment(req.body.task_id, result._id);
                if (secondResult) {
                    //Success in Adding New Attachment To Task
                    res.json({
                        status: "Success",
                        message: "Attachment Created Succesfully!",
                        data: {
                            result,
                            secondResult
                        }
                    })
                } else {
                    //Failed in Adding New Attachment To Task
                    res.json({
                        status: "Failed",
                        message: "Attachment Created Succesfully But Attachment Not added to Tasks!",
                        data: {
                            result,
                            secondResult
                        }
                    })
                }
            } catch (e) {
                console.log("Problem in /createNewAttachment Router", e);
                res.json({
                    status: "Failed",
                    message: "Some Problem in /createNewAttachment Router!",
                    data: e
                })
            }

        } else {
            //Failed in Creating New Attachment
            res.json({
                status: "Failed",
                message: "Unable to Create the Attachment!",
                data: result
            })
        }
    } catch (e) {
        console.log("Problem in /createNewAttachment Router", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /createNewAttachment Router!",
            data: e
        })
    }
});


//No need for folowing route
app.post('/createNewAttachmentAndAddToTask', async (req, res) => {
    try {
        const result = await Attachment.createNewAttachment(
            req.body.name,
            req.body.path,
            req.body.member_id
        );

        if (result) {
            //Success in Creating New Attachment
            res.json({
                status: "Success",
                message: "Attachment Created Succesfully!",
                data: result
            })
        } else {
            //Failed in Creating New Attachment
            res.json({
                status: "Failed",
                message: "Unable to Create the Attachment!",
                data: result
            })
        }
    } catch (e) {
        console.log("Problem in /createNewAttachment Router", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /createNewAttachment Router!",
            data: e
        })
    }
});


//This route returns single attachement 

app.post('/getAttachmentById', async (req, res) => {
    try {
        const result = await Attachment.getAttachmentById(req.body._id);
        if (result) {
            //Get Attachment Successfully
            res.json({
                status: "Success",
                message: "Get Attachment Succesfully!",
                data: result
            });
        } else {
            //Get Attachment Unsuccessful
            res.json({
                status: "Failed",
                message: "Attachment Not Found!",
                data: result
            });
        }
    } catch (e) {
        console.log("Problem in /getAttachmentById Route", e);
        res.json({
            status: "Failed",
            message: "Some Problem in /getAttachmentById Router!",
            data: e
        })
    }
});



module.exports = app;
