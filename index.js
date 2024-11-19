require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productrouter = require("./routes/user");
const PORT = process.env.port;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", productrouter);

mongoose
  .connect(process.env.data_base_url)
  .then(() => console.log("server connected"));

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
