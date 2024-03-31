const mongoose = require("mongoose");
require("dotenv").config();
const dbconnection = () => {
  let URL = process.env.MONGODB_URL;
  mongoose
    .connect(URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = dbconnection;
