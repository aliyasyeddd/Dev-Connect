const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoURL",
    "gender",
    "age",
    "about",
    "skills",
  ];

   //Edit profile data - check if every field which is coming from the client is present in the allowedEditFields array or not 
   const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))

  return isEditAllowed;
}

const validatePasswordUpdate = (req) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error("Both passwords are required!");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter a strong new password!");
  }
};


module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePasswordUpdate
};
