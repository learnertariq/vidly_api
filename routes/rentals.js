const router = require("express").Router();
const Fawn = require("fawn");
const mongoose = require("mongoose");

const auth = require("../middlewares/auth");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();

  res.send(rentals);
});

Fawn.init(mongoose);

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not found");

  const rental = new Rental({
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: { title: movie.title, dailyRentalRate: movie.dailyRentalRate },
  });

  new Fawn.Task()
    .save("rentals", rental)
    .update(
      "movies",
      { _id: movie._id },
      {
        $inc: { numberInStock: -1 },
      }
    )
    .run();

  res.send(rental);
});

module.exports = router;
