const mongoose = require('mongoose');
connectToDB = () => {
    mongoose.connect('mongodb://localhost:27017/ProMan', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log("Database connected!");
    });

}

module.exports={connectToDB};
