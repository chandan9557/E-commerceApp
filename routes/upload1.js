const router = require("express").Router();
const multer = require("multer");
const auth = require("../middlewere/auth");
const authAdmin = require("../middlewere/authAdmin");


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("user_file");

router.post("/upload",auth,authAdmin, upload, (req, resp) => {
    const uploadedFile = req.file; 
    // Generate URL for accessing the uploaded file
  const fileURL = `${req.protocol}://${req.get('host')}/uploads/${uploadedFile.filename}`;

  resp.json({ fileURL });
  //resp.send("file upload");
});

 module.exports = router;

