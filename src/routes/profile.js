const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData, validatePasswordUpdate } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user


    Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
    await loggedInUser.save()

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user
    validatePasswordUpdate(req)
    const isPasswordMatching = await user.validatePassword(oldPassword)
    if(!isPasswordMatching) {
      throw new Error("Old password is incorrect")
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash
    await user.save()
    res.json({
      message: "Password changed successfully"
    })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})


module.exports = profileRouter;