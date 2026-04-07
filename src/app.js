
const express = require('express');

const app = express();


app.get("/getUserData", (req, res) => {
  try {
  throw new Error("Error while fetching user data");
  res.send("User Data Sent");
  } catch (err) {   
    res.status(500).send("something went wrong");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if(err) {
    //log your error message
    res.status(500).send("something went wrong");
  }
});


app.listen(7777, () => {
  console.log('Server is running on port 7777');
});