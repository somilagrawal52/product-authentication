const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  salt: {
    type: String,
    required: true,
  },
});

userschema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(user.password, salt);

  user.salt = salt;
  user.password = hashedpassword;

  next();
});

// Define the matchPassword instance method
userschema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userschema);

module.exports = User;
