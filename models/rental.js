const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const moment = require("moment");

const { customerSchema } = require("./customer");
const { movieSchema } = require("./movie");

const newCustomerSchema = _.pick(customerSchema.obj, [
  "name",
  "isGold",
  "phone",
]);
const newMovieSchema = _.pick(movieSchema.obj, ["title", "dailyRentalRate"]);

const rentalSchema = new mongoose.Schema({
  customer: { type: newCustomerSchema, required: true },
  movie: { type: newMovieSchema, required: true },
  dateOut: { type: Date, default: Date.now(), required: true },
  dateReturn: Date,
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.methods.return =  function () {
  this.dateReturn = Date.now();
  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

rentalSchema.statics.lookup = function (customerId, movieId)  {
  return this.findOne({
    "customer._id": mongoose.Types.ObjectId(customerId),
    "movie._id": mongoose.Types.ObjectId(movieId),
  });
};

const Rental = mongoose.model("Rental", rentalSchema);

const validateRental = function (body) {
  const schema = Joi.object().keys({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(body);
};

module.exports = { Rental, validate: validateRental };
