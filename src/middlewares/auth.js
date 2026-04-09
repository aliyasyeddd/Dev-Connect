const jwt = require("jsonwebtoken");
const User = require("../models/user");

//basically checking if the token is valid or not and if the user exists or not
const userAuth = async (req, res, next) => {
  try {
    //read the token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!!!!!!!!!");
    }
    
    //verify the token and get the decoded object from the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
   
    const { _id } = decodedObj;

    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    //attached user to the request object so that we can access it in the next middleware or route handler
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
