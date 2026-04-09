
const express = require('express');
//connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

//login API - POST /login - check if the user with the given emailId exists in the database and 
// if it exists then compare the password with the hashed password stored in the database and
//  if it matches then send a success message to the client otherwise send an error message
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
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

      // Add the token to cookie and send the response back to the user
      //sending response back express gives a good way to attach cookie to the response object and send it back to the client
      res.cookie("token", token)
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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    //token is the string which we have sent to the client in the cookie and 
    //whenever the client sends a request to the server it will automatically attach the cookie to the request and
    //we can access it using req.cookies and then we can extract the token from the cookies and
    //verify it using the secret key which we have used to sign the token and
    //if the token is valid then we can get the user id from the decoded message and 
    //then we can find the user in the database using the user id and send the user data back to the client
    if (!token) {
      throw new Error("Invalid Token");
    }


    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    
    //whenever you need to read the cookie - you need to use a middleware called cookie-parser 
    // which will parse the cookies and attach it to the request object and then you can access it using req.cookies

    //decodedMessage will contain the data which we have hidden in the token and 
    // also it will contain some other information like iat (issued at) which is the time
    //  when the token was issued and exp (expiration time) which is the time when the token will expire
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  //runValidators option will run the validators defined in the schema 
  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
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


