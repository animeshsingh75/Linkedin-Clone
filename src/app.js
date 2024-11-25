const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello World!");
});

app.use("/hello", (req, res) => {
  res.send("Hello from hello");
});

app.use("/", (req, res) => {
  res.send("Hello from home!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
