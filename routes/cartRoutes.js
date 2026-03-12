const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken); // all cart routes require login

router.get("/",                  getCart);
router.post("/",                 addToCart);
router.put("/:product_id",       updateCartItem);
router.delete("/clear",          clearCart);
router.delete("/:product_id",    removeFromCart);

module.exports = router;
