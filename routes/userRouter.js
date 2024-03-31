const userCtlr = require("../controllers/userController");
const auth = require("../middlewere/auth");

const router = require("express").Router();

router.post("/register", userCtlr.userRegister1);
router.post('/login',userCtlr.login);
router.post('/changepss',auth,userCtlr.changepassword);
router.get('/logout',userCtlr.logout);
router.get('/infor',auth,userCtlr.getUser);
router.post("/refreshtoken", userCtlr.refreshtoken);

module.exports = router;
