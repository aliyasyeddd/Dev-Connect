const express = require('express');
const userRouter = express.Router()

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });

    } catch (err) {
        req.statusCode(400).send("ERROR: " + err.message);
    }
})


// Get all the accepted connections for the loggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;


        //user1 sent connection to user2 and user2 accepted the request
        //user2 sent connection to user3 and user3 accepted the request
        //either user2 can be sender or receiver of the connection request but the status should be accepted
        //populate will replace the userId with the actual user data but only the
        //fields which are mentioned in the second parameter of populate will be replaced
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);
            
        // sending only the user data of the connected user not the whole connection request data
        const data = connectionRequests.map((row) => {
            //if the loggedIn user is the sender of the connection request then we will send the receiver's data and 
            //if the loggedIn user is the receiver of the connection request then we will send the sender's data
            //if we don't check this it will send the loggedIn user's data in both cases which is not correct we need to send 
            // the other user's data
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });


        res.json({ data });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})



module.exports = userRouter;