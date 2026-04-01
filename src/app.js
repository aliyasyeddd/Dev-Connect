//whenever we change something  in code, we need to restart the server to see the changes.
//to avoid this, we can use nodemon, which will automatically restart the server whenever we make changes to the code.


//creating server using express
const express = require('express');

//creating an instance of express
const app = express();

//request handler
app.get('/', (req, res) => {
    res.send('server is running!');
});


app.use('/hello', (req, res) => {
    res.send('hello hello from the server!');
});

app.use("/test", (req, res) => {
    res.send("This is a test route");
});

//listening to the server
//when we call the listen method, it will start the server and listen on the specified port
app.listen(7777, () => {
  console.log('Server is running on port 7777');
});