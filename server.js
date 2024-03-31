const express = require("express");
const cors = require("cors");
const dbconnection = require("./database/db");
const router1 = require("./routes/userRouter");
const app = express();
require("dotenv").config();
const cookieparser = require("cookie-parser");
const router2 = require("./routes/categoryRouter");
const router3 = require("./routes/productRouter");
const router = require("./routes/upload");
const fileupload = require("express-fileupload");

dbconnection();

app.use(express.json());
app.use(cookieparser());
app.use(cors());
// upload file on cloudnary
app.use(
  fileupload({
    useTempFiles: true,
  })
);

// app.get("/", (req, res) => {
//   res.send({ msg: "get data" });
// });

// set routes
app.use("/users", router1);
app.use("/api", router2);
app.use("/api", router3);
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server started");
});
