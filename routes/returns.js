const router = require("express").Router();

const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { Movie } = require("../models/movie");
const { Rental, validate: validateRental } = require("../models/rental");

router.post("/", [auth, validate(validateRental)], async (req, res, next) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("No rental found");

  if (rental.dateReturn)
    return res.status(404).send("Rental already processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: req.body.movieId },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  res.send(rental);
});

module.exports = router;
