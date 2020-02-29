const express = require('express');
const app = express();
const PORT = 2222 || process.env.PORT;
const UserSchema=require('./Schemas/UserSchema');
const {connectToDB} = require('./connectToDB.js');

connectToDB();

app.get('/', (req, res) => {
    test();
    
    res.send('Hello World');
})

app.listen(PORT, (e) => {
    console.log(`Server started at Port # ${PORT}`);
});








const test = async() => {
    console.log("----------------------Working!----------------------");
    const user = await new UserSchema({_id:4, name: "ss" });
    const result = await UserSchema.create(user);
    if (result) {
        console.log("-----------------Yeeeeessss Success!----------------");
    }
    console.log("----------------------Working!----------------------");
}