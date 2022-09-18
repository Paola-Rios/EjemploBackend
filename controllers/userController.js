const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.addUser = catchAsync(async (req, res) => {
  req.body.password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  let newUser = await User.create(req.body);
  newUser = newUser.toObject();
  delete newUser.password;

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  let foundUser = await User.findById(req.params.id);
  if (foundUser) {
    foundUser = foundUser.toObject();
    delete foundUser.password;

    res.status(200).json({
      status: "success",
      data: {
        user: foundUser,
      },
    });
  }else {
    res.status(404).json({
      status: "not-found",
      error: "The user with the provided id was not found."
    });
  }
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //TODO: Remove the password from users
  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: users.length,
    data: {
      users
    },
  });
});


exports.updateUser = catchAsync(async (req, res) => {
  let foundUser = await User.findById(req.params.id);
  if(foundUser) {
    const updatedUser = req.body;
    foundUser.userName = updatedUser.userName;
    //TODO: Update password to be encrypted.
    foundUser.password = updatedUser.password;
    foundUser.email = updatedUser.email;
    foundUser.save();

    foundUser = foundUser.toObject()
    delete foundUser.password;

    res.status(200).json({
      status: "success",
      data: {
        user: foundUser,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});

exports.deleteUser = catchAsync(async (req, res) => {
  let foundUser = await User.findById(req.params.id);
  if(foundUser) {
    foundUser.deleteOne();
    foundUser = foundUser.toObject()
    delete foundUser.password;

    res.status(200).json({
      status: "success",
      data: {
        user: foundUser,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});