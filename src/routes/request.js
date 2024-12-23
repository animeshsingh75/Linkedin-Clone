const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request");
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});

module.exports = requestRouter;
