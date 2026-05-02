const express = require('express');
const { validateSignUpData } = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//signup - API
authRouter.post("/signup", async (req, res) => {
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
    //after signup the user will be automatically logged in and for that we need to generate a JWT token for the user and send it to the frontend in the cookie so
    //that the frontend can use that token to authenticate the user in subsequent requests
    const savedUser = await user.save();
    //generating a JWT token for the  signed-up user
    const token = await savedUser.getJWT();

    //setting the token in the cookie with an expiry time of 8 hours (8 * 3600000 milliseconds)
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

});

//login API - POST /login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;


    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //generating a JWT token for the logged-in user
      const token = await user.getJWT();

      //setting the token in the cookie with an expiry time of 8 hours (8 * 3600000 milliseconds)
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})



//Logout - API - telling the browser: “This cookie is already expired → remove it” 
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
})

module.exports = authRouter;