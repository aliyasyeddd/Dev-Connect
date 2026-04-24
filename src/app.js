const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");


//cors is a middleware which allows us to specify which frontend application can access our backend APIs and 
//also allows us to specify whether the frontend application can send cookies or not
app.use(
  cors({
    origin: "http://localhost:5173",
    //when we set credentials to true it allows the frontend application to send cookies to the backend APIs
    credentials: true,
  })
);


app.use(express.json()); //middleware to parse the incoming request body as JSON
app.use(cookieParser()); //middleware to parse the cookies and attach it to the request object


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

//whenever request coming from slash go to authRouter and check if there is any matching route in authRouter
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

//returns a promise
connectDB().then(() => {
  console.log("Database Connection established.... successfully");
  //when this code runs the server started accepting the request
  app.listen(7777, () => {
    console.log('Server is running on port 7777');
  });
}).catch((err) => {
  console.log("database connection failed!!!!");
});


