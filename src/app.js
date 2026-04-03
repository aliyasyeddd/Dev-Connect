
const express = require('express');

const app = express();


app.use("/user", (req, res, next) => {
  console.log("User route accessed");
  next(); 
  //res.send("User route");
},
  (req, res, next) => {
    //route handler
    console.log("User route accessed again");
    next(); 
    //res.send("User route again");
  }, (req, res, next) => {
    console.log("User route accessed third time");
    next();
    //res.send("User route third time");
  },(req, res, next) => {
    console.log("User route accessed fourth time");
    next();
    //res.send("User route fourth time");
  },  (req, res) => {
    console.log("User route accessed fifth time");
    res.send("User route fifth time");
  }
);

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});