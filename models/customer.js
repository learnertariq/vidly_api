const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 50 },
  isGold: { type: Boolean, default: false },
});

const Customer = mongoose.model("Customer", customerSchema);

const validateCustomer = (customer) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
};

module.exports = { Customer, validate: validateCustomer, customerSchema };
