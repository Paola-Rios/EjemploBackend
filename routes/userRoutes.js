const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const userRouter = express.Router();
//routes
userRouter
  .route("/")
  
  .all(authController.protect)
  .get(userController.getAllUsers)
  .post(userController.addUser);
userRouter
.route("/:id")

.all(authController.protect)
.get(userController.getUserById)
.put(userController.updateUser)
.delete(userController.deleteUser);

module.exports = userRouter;
