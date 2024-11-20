const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/user");
const {
  productregisterroute,
  getallproducts,
  getproduct,
  changeproduct,
  deleteproductbyid,
  registerroute,
  loginroute,
} = require("../controller/user");

router.post("/products", authMiddleware, productregisterroute);
router.get("/products", authMiddleware, getallproducts);
router.get("/products/:query", authMiddleware, getproduct);
router.put("/products/:query", authMiddleware, changeproduct);
router.delete("/products/:id", authMiddleware, deleteproductbyid);
router.post("/register", registerroute);
router.post("/login", loginroute);

module.exports = router;
