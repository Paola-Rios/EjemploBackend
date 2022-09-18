const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");
const cartRouter = express.Router();
//routes
cartRouter
  .route("/product")
  .all(authController.protect)
  .post(cartController.addCart);

cartRouter
  .route("/product/:id")
  .all(authController.protect)
  .delete(cartController.deleteProduct);

cartRouter
  .route("/pay")
  .all(authController.protect)
  .post(cartController.payCart);
module.exports = cartRouter;
