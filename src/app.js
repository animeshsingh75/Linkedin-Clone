const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const User = require("./models/user");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
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
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 604800000) });
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sending connection request");
    res.send(user.firstName + " sent the connection request");
  } catch (err) {
    res
      .status(400)
      .json({ error: "Something went wrong", details: err.message });
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
