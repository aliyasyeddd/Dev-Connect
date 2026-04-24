whenever we change something in code, we need to restart the server to see the changes.
to avoid this, we can use nodemon, which will automatically restart the server whenever we make changes to the code.

creating server using express
const express = require('express');

creating an instance of express
const app = express();

whenever a request comes to the server,the code will start executing from the top
request handler
when we pass a slash anything matches slash, so it will match all the routes, so we need to be careful while using this.
if you have app.use you can handle any request to the server, but if you have app.get,
it will only handle GET request to the specified route.
app.get('/', (req, res) => {
res.send('server is running!');
});

this will only handle GET call to /users/
ac, abc
this will match all the routes that start with /a and end with d, and have bc in between, and can have multiple bc in between
app.get('/user/:userId', (req, res) => {
console.log(req.params); this will print the query parameters in the console
res.send({ firstName: "Aliya", lastName: "syed" });
});

app.post('/user', (req, res) => {
console.log("save data to database");
res.send("data saved successfully");
});

app.delete('/user', (req, res) => {
res.send("data deleted successfully");
});

this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
res.send("This is a test route");
});

listening to the server
when we call the listen method, it will start the server and listen on the specified port
app.listen(7777, () => {
console.log('Server is running on port 7777');
});

** MIDDLEWARES & ERROR HANDLERS **

app.use("/user", (req, res) => {
route handler
res.send("User route");
console.log("User route accessed");
if we don't send a response, the request will hang and eventually time out
res.send("User route");
});

we can add multiple route handlers for the same route
app.use("/user", (req, res, next) => {
console.log("User route accessed");
next(); Call the next middleware function
res.send("User route");
},
(req, res) => {
-> route handler
console.log("User route accessed again");
res.send("User route again");
}
);

express.js allows us to create as many route handlers but at the end of the day only one response can be sent to the client.
So if we try to send multiple responses, it will throw an error.

app.use("/user", (req, res, next) => {
console.log("User route accessed");
next();
-> res.send("User route");
},
(req, res, next) => {
//route handler
console.log("User route accessed again");
next();
//res.send("User route again");
}, (req, res, next) => {
console.log("User route accessed third time");
next();
//res.send("User route third time");
},(req, res, next) => {
console.log("User route accessed fourth time");
next();
//res.send("User route fourth time");
}, (req, res) => {
console.log("User route accessed fifth time");
res.send("User route fifth time");
}
);
wrapping any two route handlers in an array has the same effect as writing them one after another

GET request comes to /user
first it will check whether we have match for /user in our route or not
it checks all the app.xxx("matching route") function
if it finds it then it executes the callback function and sends the response to the client
if it doesn't find it hangs up

the only job of express is take the request and give the response as soon as possible

Error handling middleware
app.use((err, req, res, next) => {
if(err) {
//log your error message
res.status(500).send("something went wrong");
}
});

-> route handlers functions
if you are passing two parameters first will be request and second will be response
if you are passing three parameters first request , second response , third next
if you are passing four parameters first will be error, second request, third response and fourth will be next
app.get("/getUserData", (req, res) => {
try {
throw new Error("Error while fetching user data");
res.send("User Data Sent");
} catch (err) {  
 res.status(500).send("Some Error contact support team");
}
});

// Error handling middleware
app.use((err, req, res, next) => {
if(err) {
//log your error message
res.status(500).send("something went wrong");
}
});

-> the good way is to use try catch in error handling
-> order of the functions is important
-> always write error handling towards the end

when this code runs the server started accepting the request on port 7777 and
when we hit the endpoint it will execute the code inside the callback function and send the response to the client.
app.listen(7777, () => {
console.log('Server is running on port 7777');
});

const express = require('express');
-> connect to the database and then listen to the server / api calls
const connectDB = require('./config/database');
const app = express();

-> returns a promise
connectDB().then(() => {
console.log("Database Connection established.... successfully");
-> when this code runs the server started accepting the request
app.listen(7777, () => {
console.log('Server is running on port 7777');
});
}).catch((err) => {
console.log("database connection failed!!!!");
});

whenever you are doing any database operation it is always better to use try catch block to handle the error and
avoid crashing of the server

try {
->saving the user to the database
await user.save();
res.send("User added successfully");
} catch (err) {
res.status(400).send("Error saving the user : " + err.message);
}

works for all the routes
app.use(express.json()); -> middleware to parse the incoming request body as JSON
if we don't use this middleware then we will not be able to access the data sent in the request body and it will be undefined.

app.post("/signup", async (req, res) => {
creating new user with the above data - creating a new instance of a user model
const user = new User(req.body); -> this will create a new user object with the data sent in the request body and
it will be in the format of the user schema defined in the user model.

try {
saving the user to the database
await user.save();
res.send("User added successfully");
} catch (err) {
res.status(400).send("Error saving the user : " + err.message);
}

});

Get user by email
app.get("/user", async (req, res) => {
const userEmail = req.body.emailId;
try {
-> findOne method will return the first user that matches the emailId and if there is no user with the given emailId it will return null
const user = await User.findOne({ emailId: userEmail });
if (!user) {
res.status(404).send("User not found");
} else {
res.send(user);
}
const users = await User.find({ emailId: userEmail });
if (users.length === 0) {
res.status(404).send("User not found");
} else {
res.send(users);
}
} catch (err) {
res.status(400).send("something went wrong");
}

})

Feed API - GET /feed - get all the users from the database and send it to the client
app.get("/feed", async (req, res) => {
try {
-> passing empty object to find method will return all the users in the database
const users = await User.find({});
res.send(users);
} catch (err) {
res.status(400).send("Something went wrong ");
}
});

// Update data of the user
app.patch("/user", async (req, res) => {
const userId = req.body.userId;
const data = req.body;
try {
-> options object is used to specify the options for the update operation.
-> returnDocument: "after" option is used to return the updated document after the update operation is performed.
-> If we don't specify this option, it will return the original document before the update operation is performed.
-> findByIdAndUpdate method will find the user by the given userId and
-> update the user data with the given data and return the updated user data
const user = await User.findByIdAndUpdate({ \_id: userId }, data, {
returnDocument: "after",
});
res.send("User updated successfully");
} catch (err) {
res.status(400).send("Something went wrong ");
}
});

required means that this field is mandatory and if we try to save a user without this field then it will throw an error. in schema model
unique identifier for each user - emailId should be unique for each user and it should be required field
->whenever we create a new user and if we don't provide the about field then
->it will take the default value which is "This is a default about of the user!".
about: {
type: String,
default: "This is a default about of the user!",
},

-> to keep ur email id consistent we can convert it to lowercase before saving it to the database using lowercase option in the schema.
emailId: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true ->to remove any whitespace from the email id before saving it to the database.
},

gender: {
type: String,
-> to validate the gender data we can use the validate option in the schema and we can check if the value is either male, female or others and if it is not then we can throw an error.  
 -> validate method will oly be called when new document is being created
validate(value) {
if (!["male", "female", "others"].includes(value)) {
throw new Error("Gender data is not valid");
}
},
},

-> Update data of the user
app.patch("/user", async (req, res) => {
const userId = req.body.userId;
const data = req.body;
-> runValidators option will run the validators defined in the schema
-> before updating the user data and if there is any validation error then it will throw an error and
-> the user data will not be updated in the database.
try {
const user = await User.findByIdAndUpdate({ \_id: userId }, data, {
returnDocument: "after",
runValidators: true,
});
res.send("User updated successfully");
} catch (err) {
res.status(400).send("UPDATE FAILED:" + err.message);
}
});

-> timestamps option will add createdAt and updatedAt fields to the user document and
-> it will automatically update the updatedAt field whenever we update the user document.
{
timestamps: true,
}

-> to validate the email id we can use the validate option in the schema and we can use the
-> validator library to validate the email id and if the email id is not valid then we can throw an error.
validate(value) {
if (!validator.isEmail(value)) {
throw new Error("Invalid email address: " + value);
}
},

->Encrypt the password
->hash method will return a promise and it takes two arguments first is the password
->that we want to hash and second is the number of rounds for hashing which is 10 in this case
->the higher the number of rounds the more secure the password will be but it will also take more time to hash the password
->the hash method will return the hashed password which we can store in the database instead of the plain text password
-> once you have encrypted the password you cannot get the plain text back
from the hashed password so even if someone gets access to the database they cannot see the plain text password of the users
const passwordHash = await bcrypt.hash(password, 10);
console.log(passwordHash)

-> never specify whether the emailId or password is incorrect because it can give a hint to the attacker about
which one is correct and which one is not
throw new Error("Invalid credentials");

-> sending response back express gives a good way to attach cookie to the response object and send it back to the client

app.use(cookieParser()); //middleware to parse the cookies and attach it to the request object

-> login API - POST /login - check if the user with the given emailId exists in the database and
-> if it exists then compare the password with the hashed password stored in the database and
-> if it matches then send a success message to the client otherwise send an error message
app.post("/login", async (req, res) => {
try {
const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      ->  Create a JWT Token
      -> hiding the user id (data) and also adding a secret key which only the server knows
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
      console.log(token)

      ->  Add the token to cookie and send the response back to the user
      -> sending response back express gives a good way to attach cookie to the response object and send it back to the client
      res.cookie("token", token)
      res.send("Login successful");
    } else {
      -> never specify whether the emailId or password is incorrect because it can give a hint to the attacker about
      ->  which one is correct and which one is not
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

    -> token is the string which we have sent to the client in the cookie and
    -> whenever the client sends a request to the server it will automatically attach the cookie to the request and
    -> we can access it using req.cookies and then we can extract the token from the cookies and
    -> verify it using the secret key which we have used to sign the token and
    -> if the token is valid then we can get the user id from the decoded message and
    -> then we can find the user in the database using the user id and send the user data back to the client
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    console.log(decodedMessage);

    -> decodedMessage will contain the data which we have hidden in the token and
    ->  also it will contain some other information like iat (issued at) which is the time
    ->   when the token was issued and exp (expiration time) which is the time when the token will expire
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

-> whenever you need to read the cookie - you need to use a middleware called cookie-parser
-> which will parse the cookies and attach it to the request object and then you can access it using req.cookies
/basically checking if the token is valid or not and if the user exists or not
const userAuth = async (req, res, next) => {
try {
-> read the token from the request cookies
const { token } = req.cookies;
if (!token) {
throw new Error("Token is not valid!!!!!!!!!");
}

-> verify the token
const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
-> validate the token

    const { _id } = decodedObj;

-> find the user
const user = await User.findById(\_id);
if (!user) {
throw new Error("User not found");
}
-> attached user to the request object so that we can access it in the next middleware or route handler
req.user = user;
next();
} catch (err) {
res.status(400).send("ERROR: " + err.message);
}
};

logic to expire the cookie after 8 hours - we are setting the expiry time of the cookie to 8 hours from the current time
res.cookie("token", token, {
expires: new Date(Date.now() + 8 \* 3600000),
});

-> expire the token after 1 day

-> don't use arrow function here because we need to use the this keyword to access the user document
-> and arrow function doesn't have its own this keyword.
-> if user is aliya - it will get jwt token for aliya and if user is john - it will get jwt token for john
-> because we are using the this keyword to access the user document and we are generating the token based on the user document.
userSchema.methods.getJWT = async function () {
const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "7d",
    });

    return token;

};

const token = await user.getJWT(); -> offloaded the logic of generating JWT token to the user model
-> because it is related to the user and it is better to keep it in the user model rather than in the route handler

Encrypt the password
hash method will return a promise and it takes two arguments first is the password
that we want to hash and second is the number of rounds for hashing which is 10 in this case
the higher the number of rounds the more secure the password will be but it will also take more time to hash the password
the hash method will return the hashed password which we can store in the database instead of the plain text password

along with the decoded object we are also passing the secret key which is used to sign the token
generating the token in the getJWT method of the user model
const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

-> Here you are storing: user’s MongoDB \_id in the token’s payload, which is a common practice
-> for identifying the user in subsequent requests.
-> The token is signed using a secret key ("DEV@Tinder$790") to ensure its integrity and authenticity.
-> The token is set to expire in 7 days, which means the user will need to log in again after that period to get a new token.
const token = await jwt.sign({ \_id: user.\_id }, "DEV@Tinder$790", {
expiresIn: "7d",
});

Secret Key
This is used to sign the token
Think of it like a password for your server
Only your backend should know this

After signing, you get:
HEADER . PAYLOAD . SIGNATURE
Takes payload:{ "\_id": "???" }
Adds timestamps:
Signs using secret → creates token

generates a JWT token for that user
const token = await user.getJWT();

res.cookie("token", token)
You are sending the token to the browser as a cookie
"token" → cookie name
token → cookie value

| _ DIVING INTO API'S AND EXPRESS ROUTER _ |
app.use() it is same as authRouter.use()

-> whenever request coming from slash go to authRouter and check if there is any matching route in authRouter
app.use("/", authRouter)

->login API - POST /login
->the user logs in using email and password, if the credentials are valid, a JWT token is generated and sent back to the client in a cookie.
->The token expires in 8 hours. If the credentials are invalid, an error message is sent back to the client.

->Logout - API - telling the browser: “This cookie is already expired → remove it”
->remove the token cookie from the browser by setting it to null and expiring it immediately
authRouter.post("/logout", (req, res) => {
res.cookie("token", null , {
expires: new Date(Date.now()),
});
res.send();
})

-> Edit profile data - check if every field which is coming from the client is present in the allowedEditFields array or not
const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))

-> req.user is the logged in user whose profile we want to edit and we can access it in the route handler because
-> we have used the userAuth middleware which is setting the req.user to the logged in user.
const loggedInUser = req.user

->req.body - user is sending only those fields which he wants to update and we are updating only those fields in the user document
->which are coming from the client. then we are checking if the field which is coming from the client is present in the allowedEditFields array or not and if it is not then we are throwing an error.
Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

**_ LOGICAL DB QUERY AND & COMPOUND INDEXES _**

->create an enum restrict users for some values
->enum is a validator that checks if the value of the field is one of the specified values and if it is not then it will throw an error.
->schema level validation is a powerful tool that allows you to ensure that the data being stored in your database is valid and consistent. By using enums, you can restrict the values of a field to a specific set of values, which can help prevent errors and ensure that your data is consistent.
enum: {
values: ["ignored", "interested", "accepted", "rejected"]
}

  gender: {
        type: String,
        ->  Enum validation ensures that only predefined values are allowed
        enum: {
            ->  Allowed values for the gender field
            values: ["male", "female", "other"],
            ->  Custom error message if the value is not in the allowed list
            ->  {VALUE} will be replaced with the invalid value entered
            message: `{VALUE} is not a valid gender type`,
        },
        ->  Custom validator (alternative to enum)
        ->  This manually checks if the provided value exists in the allowed list
        ->  If not, it throws an error
        ->  validate(value) {
        ->    if (!["male", "female", "others"].includes(value)) {
        ->      throw new Error("Gender data is not valid");
        ->    }
        ->  },
    },



  {
        -> Automatically adds two fields:
        -> createdAt -> when the document was created
        -> updatedAt -> when the document was last updated
        timestamps: true
    }




:status - dynamic status
either it can can interested or rejected




    -> checking if user exists in database or not
    const toUser = await User.findById(toUserId);
    -> if we send request to not existing user in database
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }



-> whenever you write pre opr schema write with function declaration don't use arrow function



-> if you create index in your database on the first name db will optimize like that your query will become fast
-> suppose if we don't put index to email to login api will become slow
-> if you are making any field unique i.e., if you are saying email-id is unique
-> mongodb automatically creates index for that-
-> Unique index. If you specify `unique: true`
-> specifying `index: true` is optional if you do `unique: true`



-> ConnectionRequest.find({fromUserId: 273478465864786587, toUserId: 273478465864786587})
-> connection request will be fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
 -> if you put compound index on the both items this query will be fast
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });



-> suppose you want to find user by first name + last name i will create compound index on both fields
-> { fromUserId: 1, toUserId: 1 } queries will be fast
-> when you create a lot of indexes it will be tough for db to handle if there are 1lakh + users it makes sense to add these compound index




->userAuth will check whether cookie has token and token is valid or not , and it will find information about the logged in user , it will get data of logged in user from database it will call the next function

-> use cases for request/review/:status/:requestId
-> validate the status
-> 1. user1 - user2
-> 2. loggedInId(user2) - toUserId
-> 3. status = interested
-> 4. request id should be valid




-> .find method returns you an array of saved objects from database
-> .findOne method returns you an one object



-> whenever user sends connection request mongodb creates a reference between connectionRequest and user schema
-> ref: "User" -> from user id to user which isin user schema
-> fromUserId is reference to user collection
 fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the user collection
        required: true,
    },
-> Link between two collections fetch and populate data
-> also be careful while getting data from data base abd sending back to user



-> user1 sent connection to user2 and user2 accepted the request
-> user2 sent connection to user3 and user3 accepted the request
-> either user2 can be sender or receiver of the connection request but the status should be accepted
-> populate will replace the userId with the actual user data but only the
-> fields which are mentioned in the second parameter of populate will be replaced
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);





-> sending only the user data of the connected user not the whole connection request data
        const data = connectionRequests.map((row) => {
           -> if the loggedIn user is the sender of the connection request then we will send the receiver's data and 
           -> if the loggedIn user is the receiver of the connection request then we will send the sender's data
            -> if we don't check this it will send the loggedIn user's data in both cases which is not correct we need to send 
            -> the other user's data
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data });



        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            -> if the loggedIn user is the sender of the connection request then we will hide the receiver's card from the feed and
            hideUsersFromFeed.add(request.fromUserId.toString());
            -> if the loggedIn user is the receiver of the connection request then we will hide the sender's card from the feed
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                -> hide the users whose cards i have sent or received connection request to/from
                -> nin means not in and it will check if the _id of the user is not in the hideUsersFromFeed set then only it will be included in the result
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                -> hide my own card from the feed
                -> ne means not equal and it will check if the _id of the user is not equal to the loggedIn user's _id then only it will be included in the result
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA)



-> cors is a middleware which allows us to specify which frontend application can access our backend APIs and 
-> also allows us to specify whether the frontend application can send cookies or not
app.use(
  cors({
    origin: "http://localhost:5173",
    -> when we set credentials to true it allows the frontend application to send cookies to the backend APIs
    credentials: true,
  })
);
