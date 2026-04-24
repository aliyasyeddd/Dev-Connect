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
    await user.save();
    res.send("User added successfully");
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
      const token = await user.getJWT(); 
      
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
  res.cookie("token", null , {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
})

module.exports = authRouter;