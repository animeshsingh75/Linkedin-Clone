const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password isnt strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (
          !["Male", "Female", "Others", "male", "female", "others"].includes(
            value
          )
        ) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://liccar.com/wp-content/uploads/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png",
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user",
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    skills: {
      type: [String],
      validate(array) {
        if (array.length > 10) {
          throw new Error("Skills can't be more than 10");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
