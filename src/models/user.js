const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        trim: true, //to remove any whitespace from the email id before saving it to the database.
        //to validate the email id we can use the validate option in the schema and we can use the
        //  validator library to validate the email id and if the email id is not valid then we can throw an error.
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password: " + value);
            }
        },
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
    photoURL: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        },
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

//don't use arrow function here because we need to use the this keyword to access the user document
//  and arrow function doesn't have its own this keyword.
//if user is aliya - it will get jwt token for aliya and if user is john - it will get jwt token for john 
// because we are using the this keyword to access the user document and we are generating the token based on the user document.
userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "7d",
    });

    return token;
};


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);