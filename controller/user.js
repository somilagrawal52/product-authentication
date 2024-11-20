const { Product, validateProduct } = require("../models/product");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

async function productregisterroute(req, res) {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { name, price, category, description } = req.body;
  try {
    let product = await Product.findOne({ name });
    if (product) {
      return res.status(400).json({ message: "product already exists" });
    }

    product = new Product({
      name,
      price,
      category,
      description,
    });

    await product.save();
    res.status(201).json({ message: "product registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getallproducts(req, res) {
  const allproducts = await Product.find({});
  const pageCount = Math.ceil(allproducts.length / 2);
  let page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  if (page > pageCount) {
    page = pageCount;
  }
  res.json({
    page: page,
    pageCount: pageCount,
    products: allproducts.slice(page * 2 - 2, page * 2),
  });
}

async function getproduct(req, res) {
  const query = req.params.query;
  console.log(`Received query: ${query}`);
  if (mongoose.Types.ObjectId.isValid(query)) {
    try {
      const product = await Product.findById(query);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found matching the keyword" });
      }
      return res.json(products);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

async function changeproduct(req, res) {
  const query = req.params.query;
  if (mongoose.Types.ObjectId.isValid(query)) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const { error } = validateProduct(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const { name, price, category, description } = req.body;
      const exists = await Product.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: "product already exists" });
      }

      product.name = name;
      product.price = price;
      product.category = category;
      product.description = description;

      await product.save();
      res
        .status(201)
        .json({ message: "product updated successfully", product });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found matching the keyword" });
      }
      const { error } = validateProduct(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const { name, price, category, description } = req.body;
      const exists = await Product.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: "product already exists" });
      }

      products.name = name;
      products.price = price;
      products.category = category;
      products.description = description;

      await products.save();
      res
        .status(201)
        .json({ message: "product updated successfully", products });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

async function deleteproductbyid(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
}
async function loginroute(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send("Email and password are required");
  } else {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password." });
      }
      const correctPassword = await user.matchPassword(password);
      if (!correctPassword) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password." });
      }
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.secret
      );

      res.json({ message: "Successfully logged in", token });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

async function registerroute(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      salt: "sa",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  productregisterroute,
  getallproducts,
  getproduct,
  changeproduct,
  deleteproductbyid,
  loginroute,
  registerroute,
};
