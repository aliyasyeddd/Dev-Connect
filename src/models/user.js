const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//The identity of a user
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
        unique: true, // Unique index. If you specify `unique: true`
        lowercase: true,
        trim: true, //to remove any whitespace from the email id before saving it to the database.
        // to validate the email id we can use the validate option in the schema and we can use the
        // validator library to validate the email id and if the email id is not valid then we can throw an error.
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
        // Enum validation ensures that only predefined values are allowed
        enum: {
            // Allowed values for the gender field
            values: ["male", "female", "other"],
            // Custom error message if the value is not in the allowed list
            // {VALUE} will be replaced with the invalid value entered
            message: `{VALUE} is not a valid gender type`,
        },
        // Custom validator (alternative to enum)
        // This manually checks if the provided value exists in the allowed list
        // If not, it throws an error
        // validate(value) {
        //   if (!["male", "female", "others"].includes(value)) {
        //     throw new Error("Gender data is not valid");
        //   }
        // },
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