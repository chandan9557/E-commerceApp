const router = require("express").Router();
const productCtrl = require("../controllers/productCtrl");
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key : process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET
})

router
  .route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.createProducts);

router
  .route("/products/:id")
  .delete(productCtrl.deleteProduct)
  .put(productCtrl.updateProduct);

module.exports = router;
