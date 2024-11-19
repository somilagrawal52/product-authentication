const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(1).required(),
    category: Joi.string().required(),
    description: Joi.string(),
  });
  return schema.validate(product);
}

const Product = mongoose.model("product", productSchema);

module.exports = {
  validateProduct,
  Product,
};
