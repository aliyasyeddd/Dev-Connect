
const express = require('express');
//connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post("/signup", async (req, res) => {
  //creating new user with the above data - creating a  new instance of a user model
  const user = new User({
    firstName: "faiza",
    lastName: "asifa",
    emailId: "faizavibe@gmail.com",
    password: "faiza@45#",
  });

  //whenever you are doing any database operation it is always better to use try catch block to handle the error and 
  // avoid crashing of the server

  try {
    //saving the user to the database
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
  }

});

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


