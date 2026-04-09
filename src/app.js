
const express = require('express');
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

    const passwordHash = await bcrypt.hash(password, 10);

    // creating a  new instance of a user model
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

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT(); 
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successful");
    } else {
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


