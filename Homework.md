Create a repository
Initialize the repository
node_modules, package.json, package-lock.json
Install express
Create a server
Listen to port 7777
Write request handlers for /test , /hello
Install nodemon and update scripts inside package.json
initialize git
.gitignore
Create a remote repo on github
Push all code to remote origin
Play with routes and route extensions ex. /hello, / , hello/2, /xyz
Order of the routes matter a lot
Install Postman app and make a workspace/collection > test API call
Write logic to handle GET, POST, PATCH, DELETE API Calls and test them on Postman
Create a free cluster on MongoDB official website (Mongo Atlas)
Install mongoose library
Connect your application to the Database "Connection-url"/devTinder
Call the connectDB function and connect to database before starting application on 7777
Create a userSchema & user Model
Create POST /signup API to add data to database
Push some documents using API calls from postman
Error Handling using try , catch
Add the express.json middleware to your app
Make your signup API dynamic to receive data from the end user
User.findOne with duplicate email ids, which object returned
API- Get user by email
API - Feed API - GET /feed - get all the users from the database
API - Get user by ID
Create a delete user API
Difference between PATCH and PUT
API - Update a user
API - Update the user with email ID
add required, unique, lowercase, min, minLength, trim
Add default
Create a custom validate function for gender
Improve the DB schema PUT all appropriate validations on each field in Schema
Add timestamps to the userSchema
 Add API level validation on Patch request & Signup post api
 DATA Sanitizing - Add API validation for each field
Install validator
Explore validator library function and Use validator function for password, email, photoURL
NEVER TRUST req.body
Validate data in Signup API
Install bcrypt package
Create PasswordHash using bcrypt.hash & save the user is encrypted password
Create login API
Compare passwords and throw errors if email or password is invalid
install cookie-parser
just send a dummy cookie to user
create GET /profile APi and check if you get the cookie back
install jsonwebtoken 
IN login API, after email and password validation, create e JWT token and send it to user in cookies
read the cookies inside your profile API and find the logged in user
userAuth Middleware
Add the userAuth middle ware in profile API and a new sendConnectionRequest API
Set the expiry of JWT token and cookies to 7 days
Create userSchema method to getJWT() 
Create UserSchema method to compare password(passwordInputByUser)
Explore tinder APIs
Create a list all API you can think of in Dev Tinder
Group multiple routes under respective routers
Read documentation for express.Router
Create routes folder for managing auth,profile, request routers
create authRouter, profileRouter, requestRouter
Import these routers in app.js
Create POST /logout API
Create PATCH /profile/edit
Create PATCH /profile/password API => forgot password API
Make you validate all data in every POST, PATCH apis
Make you validate all data in every POST, PATCH apis
Create Connection Request Schema
Send Connection Request API
Proper validation of Data
Think about ALL corner cases
$or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/operator/query-logical/
schema.pre("save") function
Read more about indexes in MongoDB
Why do we need index in DB?
What is the advantages and disadvantage of creating?
Read this article about compound indexes - https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
ALWAYS THINK ABOUT CORNER CASES 


//questions 
What are dependencies
What is the use of "-g" while npm install
Difference between caret and tilde ( ^ vs ~ )
Reading the query params in the routes
Reading the dynamic routes
What is a Middleware? Why do we need it?
How express JS basically handles requests behind the scenes
Difference app.use and app.all
Write a dummy auth middleware for admin
Write a dummy auth middleware for all user routes, except /user/login
Error Handling using app.use("/", (err, req, res, next) = {});
Explore routing and use of ?, + , (), * in the routes
Use of regex in routes /a/ , /.*fly$/
Multiple Route Handlers - Play with the code
next()
next function and errors along with res.send()
app.use("/route", rH, [rH2, rH3], rH4, rh5);
JS object vs JSON (difference)
Difference between PATCH and PUT
Explore the Mongoose Documentation for Model methods
What are options in a Model.findOneAndUpdate method, explore more about it
 Explore schema type options from the documentation
 