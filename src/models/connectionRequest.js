const mongoose = require("mongoose");

//The connection request sent by a user to another user
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        }
    }
},
    {
        timestamps: true
    }
)

//whenever you keep query with both parameter both from & to combined queries will become fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//kind of middleware every time when the connection request will be saved
//save is kind of event handler before it is saved the function will be called
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next
});

// Creating a model from the schema
const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;