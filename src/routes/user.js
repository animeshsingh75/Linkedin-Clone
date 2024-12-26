const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_FIELDS = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_FIELDS);

    res.json({ message: "Connection Requests", data: connectionRequests });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_FIELDS)
      .populate("toUserId", USER_SAFE_FIELDS);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ message: "Connection Requests", data });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" + err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(USER_SAFE_FIELDS)
      .skip(skip)
      .limit(limit);
    res.json({ message: "Feed api", data: users });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" + err.message });
  }
});
module.exports = userRouter;
