const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCtrl = {
  userRegister1: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (user) return res.status(400).json({ msg: "Already register" });
      if (password.length < 6)
        return res.status(400).json({ msg: "password at least 6 character" });
      // res.json({ msg: "Register Succussfull" });

      //Password Encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        name,
        email,
        password: passwordHash,
      });

      //Save mongodb
      await newUser.save();
      //create jwt to authenticate
      const accesstoken = createAccessToken({ id: newUser._id }); // yha se payload ke value set hga.
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ error: error.massage });
    }
  },
  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      //res.json({ rf_token });
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Registers" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });

      res.json({ user, accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changepassword: async (req, res) => {
    try {
      const { password } = req.body;
      //Password Encryption
      const newHashPassword = await bcrypt.hash(password, 10);
      const user = await userModel.findById(req.user.id).select("-password");
      await userModel.findByIdAndUpdate(req.user.id, {
        $set: { password: newHashPassword },
      });
      res.send({ status: "success", message: "Password changed succesfully" });
      // console.log(user);
    } catch (err) {
      console.log(err);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/users/refresh_token" });
      return res.json({ msg: "Log Out" });
    } catch (err) {
      console.log(err);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).select("-password");

      if (!user) return res.status(400).json({ msg: "User Not Found" });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = userCtrl;
//$2b$10$QgpzFiMuZ2uwPwr6Y7rAdOPtJX4U7dAoLrbhSgtptkvnxbl10wuWe
//$2b$10$APKPwx674CThEf1sOX6Z.OFWH0jLBxij//xtXW.v9gN5iWKbGs.t6
