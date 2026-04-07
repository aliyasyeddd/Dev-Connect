const mongoose = require('mongoose');


const connectDB = async () => {
    //connection string should be valid and should have username and password of the database user which we have created in mongodb atlas.
    await mongoose.connect("mongodb+srv://syedaliya03_db_user:1135518Aa@nodelevelone.iwr3d25.mongodb.net/devTinder"); 
    //if you write database name it will refer to database otherwise it will create a new database with the name of the collection you are using in your code.  
};

module.exports = connectDB;

