const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Validation
  try {
    validateSignUpData(req);
    // Encrypt password
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while saving user", details: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email address is not valid");
    }
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while logging in", details: err.message });
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail);
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "age",
      "gender",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while saving user", details: err.message });
  }
});

app.get("/userById", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});

app.patch("/updateUserByEmail/:emailId", async (req, res) => {
  const emailId = req.params?.emailId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "age",
      "gender",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findOneAndUpdate({ emailId: emailId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error while saving user", details: err.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong", err);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
