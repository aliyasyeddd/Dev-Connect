
const express = require('express');

const app = express();


//handle auth Middleware for all request's to /admin GET , POST , PUT , DELETE
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("User logged in successfully!");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User Data Sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a user");
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});