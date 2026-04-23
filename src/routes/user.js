const express = require('express');
const userRouter = express.Router()

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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

//user should see all the cards except
//0. his own card
//1. the cards of the users to whom he has sent connection request already(pending or accepted)
//2. ignored people's cards
//3. his connections cards
userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        //pagination parameters 
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        //Find all connection requests either i have (sent + received) 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");


        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            //if the loggedIn user is the sender of the connection request then we will hide the receiver's card from the feed and
            hideUsersFromFeed.add(request.fromUserId.toString());
            //if the loggedIn user is the receiver of the connection request then we will hide the sender's card from the feed
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                //hide the users whose cards i have sent or received connection request to/from
                //nin means not in and it will check if the _id of the user is not in the hideUsersFromFeed set then only it will be included in the result
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                //hide my own card from the feed
                //ne means not equal and it will check if the _id of the user is not equal to the loggedIn user's _id then only it will be included in the result
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


module.exports = userRouter;