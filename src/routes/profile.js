const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validatePasswordData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const user = req.user;

    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    await user.save();
    res.json({
      message: `${user.firstName}, your profile was updated successfully`,
      data: user,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    await validatePasswordData(req);

    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = req.user;
    user.password = passwordHash;
    await user.save();
    res.json({
      message: `${user.firstName}, your password was updated successfully`,
      data: user,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});

profileRouter.patch("/profile/profile", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const user = req.user;

    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    await user.save();
    res.json({
      message: `${user.firstName}, your profile was updated successfully`,
      data: user,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});
module.exports = profileRouter;
