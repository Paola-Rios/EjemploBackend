const express = require("express");
const userController = require("./../controllers/userController");
const userRouter = express.Router();
//routes
userRouter
  .route("/")
  //TODO: uncomment the following line
  // .all(authController.protect)
  .get(userController.getAllUsers)
  .post(userController.addUser);
userRouter
.route("/:id")
//TODO: uncomment the following line
// .all(authController.protect)
.get(userController.getUserById)
.put(userController.updateUser)
.delete(userController.deleteUser);

module.exports = userRouter;
