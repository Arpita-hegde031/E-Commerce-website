const db = require("../config/db");

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT w.id, p.id as product_id, p.name, p.price, p.image, p.category, p.tag, p.rating
       FROM wishlist w JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    await db.query(
      "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [req.user.id, product_id]
    );
    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/wishlist/:product_id
const removeFromWishlist = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
      [req.user.id, req.params.product_id]
    );
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
