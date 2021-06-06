const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

const validateMovie = function (movie) {
  const schema = Joi.object().keys({
    title: Joi.string().required().min(3).max(50),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().min(1).max(100),
    dailyRentalRate: Joi.number().required().min(1).max(10),
  });

  return schema.validate(movie);
};

module.exports = { Movie, validate: validateMovie, movieSchema };
