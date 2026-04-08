
const express = require('express');
//connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

//if we don't use this middleware then we will not be able to access the data sent in the request body and it will be undefined.
app.use(express.json()); //middleware to parse the incoming request body as JSON

app.post("/signup", async (req, res) => {
  //creating new user with the above data - creating a  new instance of a user model
  const user = new User(req.body); //this will create a new user object with the data sent in the request body and 
  // it will be in the format of the user schema defined in the user model.


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


