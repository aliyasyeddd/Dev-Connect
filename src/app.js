//whenever we change something  in code, we need to restart the server to see the changes.
//to avoid this, we can use nodemon, which will automatically restart the server whenever we make changes to the code.


//creating server using express
const express = require('express');

//creating an instance of express
const app = express();


//whenever a request comes to the server,the code will start executing from the top
//request handler
//when we pass a slash anything matches slash, so it will match all the routes, so we need to be careful while using this.
// app.get('/', (req, res) => {
//     res.send('server is running!');
// });

//this will only handle GET call to /users/
//ac, //abc
//this will match all the routes that start with /a and end with d, and have bc in between, and can have multiple bc in between
app.get('/user/:userId', (req, res) => {
    console.log(req.params); //this will print the query parameters in the console
    res.send({ firstName: "Aliya", lastName: "syed" });
});

// app.post('/user', (req, res) => {
//     console.log("save data to database");
//     res.send("data saved successfully");
// });

// app.delete('/user', (req, res) => {
//     res.send("data deleted successfully");
// });

// //this will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//     res.send("This is a test route");
// });

//listening to the server
//when we call the listen method, it will start the server and listen on the specified port
app.listen(7777, () => {
  console.log('Server is running on port 7777');
});