const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");
const cartRouter = express.Router();
//routes
cartRouter
  .route("/product")
  //TODO: uncomment the following line
  // .all(authController.protect)
  // .get(cartController.getAllProducts)
  .post(cartController.addCart);
  cartRouter
  // .route("/:id")
  // //TODO: uncomment the following line
  // // .all(authController.protect)
  // .get(cartController.getProductById)
  // .put(cartController.updateProduct)
  // .delete(cartController.deleteProduct);
module.exports = cartRouter;
