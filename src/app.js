const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Animesh",
    lastName: "Singh",
    email: "animeshsingh75@gmail.com",
    password: "123456780",
    age: 25,
    gender: "Male",
  });
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error while saving user", err);
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
