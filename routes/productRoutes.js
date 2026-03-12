const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyAdmin } = require("../middleware/auth");

router.get("/",            getAllProducts);
router.get("/categories",  getCategories);
router.get("/:id",         getProductById);
router.post("/",           verifyAdmin, createProduct);
router.put("/:id",         verifyAdmin, updateProduct);
router.delete("/:id",      verifyAdmin, deleteProduct);

module.exports = router;
