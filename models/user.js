const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 255, required: true },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 3, maxlength: 1024, required: true },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    _.pick(this, ["_id", "isAdmin"]),
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = function (user) {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
};

module.exports = { User, validate: validateUser };
