whenever we change something  in code, we need to restart the server to see the changes.
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
  next(); // Call the next middleware function
  res.send("User route");
},
  (req, res) => {
    //route handler
    console.log("User route accessed again");
    res.send("User route again");
  }
);

express.js allows us to create as many route handlers but at the end of the day only one response can be sent to the client. 
So if we try to send multiple responses, it will throw an error.

app.use("/user", (req, res, next) => {
  console.log("User route accessed");
  next(); 
  //res.send("User route");
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
  },  (req, res) => {
    console.log("User route accessed fifth time");
    res.send("User route fifth time");
  }
);
wrapping any two route handlers in an array has the same effect as writing them one after another

GET  request comes to /user
first it will check whether we have match for /user in our route or not
it checks all the app.xxx("matching route") function
if it finds it then it executes the callback function and sends the response to the client
if it doesn't find it hangs up

the only job of express is take the request and give the response as soon as possible

