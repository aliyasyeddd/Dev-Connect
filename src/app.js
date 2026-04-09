
const express = require('express');
//connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); //middleware to parse the incoming request body as JSON
app.use(cookieParser()); //middleware to parse the cookies and attach it to the request object

app.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    //hash method will return a promise and it takes two arguments first is the password
    //  that we want to hash and second is the number of rounds for hashing which is 10 in this case
    // the higher the number of rounds the more secure the password will be but it will also take more time to hash the password
    // the hash method will return the hashed password which we can store in the database instead of the plain text password
    const passwordHash = await bcrypt.hash(password, 10);
    //console.log(passwordHash)

    //creating new user with the above data - creating a  new instance of a user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    //saving the user to the database
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

});

//login API - POST /login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;


    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT Token
      //hiding the user id (data) and also adding a secret key which only the server knows 
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "1d" });

      // Add the token to cookie and send the response back to the user
      //sending response back express gives a good way to attach cookie to the response object and send it back to the client
      //logic to expire the cookie after 8 hours - we are setting the expiry time of the cookie to 8 hours from the current time
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successful");
    } else {
      //never specify whether the emailId or password is incorrect because it can give a hint to the attacker about 
      // which one is correct and which one is not
      throw new Error("Invalid credentials");
    }

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  // Sending a connection request
  console.log("Sending a connection request");

  res.send(user.firstName + " sent the connect request!");
})

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


