const mongoose = require("mongoose");
const URILocal = "mongodb://localhost:27017/ProMan";
const URILive =
  "mongodb+srv://usamamajid6:gD8r5oaISbDVWRIU@cluster0.hcgui.mongodb.net/ProMan?retryWrites=true&w=majority";
connectToDB = () => {
  mongoose.connect(
    URILocal,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Database connected!");
    }
  );
};


module.exports = { connectToDB };
