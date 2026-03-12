const express = require("express");
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/",                 getWishlist);
router.post("/",                addToWishlist);
router.delete("/:product_id",   removeFromWishlist);

module.exports = router;
