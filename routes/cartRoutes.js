const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");
const cartRouter = express.Router();
//routes
cartRouter
  .route("/product")
  .post(cartController.addCart);

cartRouter
  .route("/product/:id")
  .delete(cartController.deleteProduct);

cartRouter
  .route("/pay")
  .post(cartController.payCart);
module.exports = cartRouter;
