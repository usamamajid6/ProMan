const express = require('express');
const app = express();
const PORT = 2222 || process.env.PORT;
const {connectToDB} = require('./connectToDB.js');
const User = require('./Routes/UserRoutes');

connectToDB();

app.get('/', (req, res) => {
    test();
});

//<------------------User------------------>
app.post('/registerUser',User);
app.post('/loginUser',User);
app.post('/getUser',User);
app.get('/getAllUsers',User);
app.put('/updateUser',User);
app.post('/test',User);

//<----------------End User---------------->

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