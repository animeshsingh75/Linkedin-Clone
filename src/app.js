const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({
    first_name: "Animesh",
    last_name: "Singh",
  });
});

app.get("/user/:user_id", (req, res) => {
  console.log(req.params);
  res.send({
    first_name: "Animesh",
    last_name: "Singh",
  });
});

app.post("/user", (req, res) => {
  res.send("Data has been saved successfully!");
});

app.patch("/user", (req, res) => {
  res.send("Data has been updated successfully!");
});

app.delete("/user", (req, res) => {
  res.send("Data has been deleted successfully!");
});
app.use("/test", (req, res) => {
  res.send("Hello World!");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
