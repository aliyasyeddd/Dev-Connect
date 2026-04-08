const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    //to keep ur email id consistent we can convert it to lowercase before saving it to the database using lowercase option in the schema.
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true //to remove any whitespace from the email id before saving it to the database.
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        //to validate the gender data we can use the validate option in the schema and we can check if the value is either male, female or others and
        //  if it is not then we can throw an error.  
        //validate method will oly be called when new document is being created
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
    },
    //whenever we create a new user and if we don't provide the about field then
    //  it will take the default value which is "This is a default about of the user!".
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String]
    },
},
    //timestamps option will add createdAt and updatedAt fields to the user document and 
    // it will automatically update the updatedAt field whenever we update the user document.
    {
        timestamps: true,
    }
)


module.exports = mongoose.model('User', userSchema);