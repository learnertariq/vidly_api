const _ = require("lodash");
const router = require("express").Router();
const bcrypt = require("bcrypt");

const { validate } = require("../models/auth");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) return res.status(400).send("Password didn't match");

  const token = user.generateAuthToken();

  res.header("x-auth-key", token).send();
});

module.exports = router;
