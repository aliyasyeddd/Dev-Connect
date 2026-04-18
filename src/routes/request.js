const express = require("express");
const requestRouter = express.Router();


const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //status either it can interested or ignored
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    //checking if user exists in database or not
    const toUser = await User.findById(toUserId);
    //if we send request to not existing user in database
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

    //if there is an existing connection request
    // Check if a connection request already exists between the two users
    // This prevents duplicate requests (both directions: A → B or B → A)
    //if you put compound index on the both items this query will be fast
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        // Case 1: Request already sent from current user to target user
        { fromUserId, toUserId },

        // Case 2: Request already sent from target user to current user
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .send({ message: "Connection Request Already Exists!!" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connectionRequest.save()

    res.json({
      message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})



module.exports = requestRouter;