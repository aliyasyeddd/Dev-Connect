
const express = require('express');
//connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json()); //middleware to parse the incoming request body as JSON

app.post("/signup", async (req, res) => {
  //creating new user with the above data - creating a  new instance of a user model
  const user = new User(req.body);

  try {
    //saving the user to the database
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user : " + err.message);
  }

});

//Get user by email 
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    //findOne method will return the first user that matches the emailId and if there is no user with the given emailId it will return null
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("something went wrong");
  }

})

//Feed API - GET /feed - get all the users from the database and send it to the client
app.get("/feed", async (req, res) => {
  try {
    //passing empty object to find method will return all the users in the database
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    //const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});


// Update data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
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


