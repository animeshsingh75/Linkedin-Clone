const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");
const e = require("express");
const app = express();

app.use("/admin", adminAuth);
app.get("/admin/getAllUsers", (req, res) => {
  res.send("All users data");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted user data");
});

app.get("/user/login", (req, res) => {
  res.send("User logged in successfully");
});
app.get("/user/getUserData", userAuth, (req, res) => {
  throw new Error("User data not found");
  res.send("User data sent");
});
app.get("/user", userAuth, (req, res) => {
  console.log(req.query);
  res.send({
    first_name: "Animesh",
    last_name: "Singh",
  });
});

app.get("/user/:user_id", userAuth, (req, res) => {
  console.log(req.params);
  res.send({
    first_name: "Animesh",
    last_name: "Singh",
  });
});

app.post("/user", userAuth, (req, res) => {
  res.send("Data has been saved successfully!");
});

app.patch("/user", userAuth, (req, res) => {
  res.send("Data has been updated successfully!");
});

app.delete("/user", userAuth, (req, res) => {
  res.send("Data has been deleted successfully!");
});

app.use(
  "/test",
  (req, res, next) => {
    next();
    res.send("Response 1");
  },
  (req, res) => {
    res.send("Response 2");
  }
);
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
