const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = (genre) => {
  const schemeObj = { name: Joi.string().min(5).max(50).required() };
  const schema = Joi.object().keys(schemeObj);
  return schema.validate(genre);
};

module.exports = { Genre, validate: validateGenre, genreSchema };
