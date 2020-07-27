const express = require("express");
const app = express();
const Attachment = require("../API/AttachmentAPI");
const Task = require("../API/TaskAPI");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "AttachmentUploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

// app.post("/addNewFile", upload.single("file"), async (req, res, next) => {
//   try {
//     // console.log("====================================");
//     // console.log(req.body);
//     // console.log("====================================");
//     // const result = await Attachment.createNewAttachment(
//     //   "name",
//     //   req.file.path,
//     //   1,
//     //   1,
//     //   1
//     // );
//     // // req.body.name,
//     //   // req.file.path,
//     //   // req.body.member_id,
//     //   // req.body.project_id,
//     //   // req.body.task_id
//     res.send(req.file);
//   } catch (e) {}
// });

//This route create a new attachment and add this attachment_id to attachments field in Task
app.post("/createNewAttachment", upload.single("file"), async (req, res) => {
  // res.send(req.file);
  try {
    const result = await Attachment.createNewAttachment(
      req.file.originalname,
      req.file.path,
      req.body.member_id,
      req.body.project_id,
      req.body.task_id
    );
    // let data = JSON.parse(req.body.data);
    if (result) {
      //Success in Creating New Attachment
      try {
        const secondResult = await Task.addAttachment(
          req.body.task_id,
          result._id
        );
        if (secondResult) {
          //Success in Adding New Attachment To Task
          res.json({
            status: "Success",
            message: "Attachment Created Succesfully!",
            data: {
              result,
              secondResult,
            },
          });
          // res.send(req.file);
        } else {
          //Failed in Adding New Attachment To Task
          res.json({
            status: "Failed",
            message:
              "Attachment Created Succesfully But Attachment Not added to Tasks!",
            data: {
              result,
              secondResult,
            },
          });
        }
      } catch (e) {
        console.log("Problem in /createNewAttachment Router", e);
        res.json({
          status: "Failed",
          message: "Some Problem in /createNewAttachment Router!",
          data: e,
        });
      }
    } else {
      //Failed in Creating New Attachment
      res.json({
        status: "Failed",
        message: "Unable to Create the Attachment!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewAttachment Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewAttachment Router!",
      data: e,
    });
  }
});

//No need for folowing route
app.post("/createNewAttachmentAndAddToTask", async (req, res) => {
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
        data: result,
      });
    } else {
      //Failed in Creating New Attachment
      res.json({
        status: "Failed",
        message: "Unable to Create the Attachment!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /createNewAttachment Router", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /createNewAttachment Router!",
      data: e,
    });
  }
});

//This route returns single attachement

app.post("/getAttachmentById", async (req, res) => {
  try {
    const result = await Attachment.getAttachmentById(req.body._id);
    if (result) {
      //Get Attachment Successfully
      res.json({
        status: "Success",
        message: "Get Attachment Succesfully!",
        data: result,
      });
    } else {
      //Get Attachment Unsuccessful
      res.json({
        status: "Failed",
        message: "Attachment Not Found!",
        data: result,
      });
    }
  } catch (e) {
    console.log("Problem in /getAttachmentById Route", e);
    res.json({
      status: "Failed",
      message: "Some Problem in /getAttachmentById Router!",
      data: e,
    });
  }
});

app.get("/getAttachment/:fileDirectory/:filename/:orignalname", (req, res) => {
  res.download(
    `./${req.params.fileDirectory}/${req.params.filename}`,
    `${req.params.orignalname}`,
    function (err) {
      if (err) {
        res.json({
          message: "Some Problem!",
        });
      } else {
        // decrement a download credit, etc.
      }
    }
  );
  // console.log(req.params);

  // res.json({ data: req.params.filename });
});

module.exports = app;
