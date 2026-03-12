const db = require("../config/db");

// GET /api/cart  (protected)
const getCart = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price,
              p.original_price, p.image, p.category, p.tag, p.colors
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    const parsed = items.map((item) => ({
      ...item,
      colors: typeof item.colors === "string" ? JSON.parse(item.colors) : item.colors,
    }));

    const total = parsed.reduce((sum, i) => sum + i.price * i.quantity, 0);

    res.json({ success: true, items: parsed, total: parseFloat(total.toFixed(2)) });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/cart  (protected)
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: "product_id required" });
    }

    // Check product exists
    const [product] = await db.query("SELECT id FROM products WHERE id = ?", [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Upsert: if exists increment quantity, else insert
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity]
    );

    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/cart/:product_id  (protected) — set exact quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { product_id } = req.params;

    if (quantity <= 0) {
      // Remove item
      await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [req.user.id, product_id]);
      return res.json({ success: true, message: "Item removed" });
    }

    await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, req.user.id, product_id]
    );

    res.json({ success: true, message: "Cart updated" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart/:product_id  (protected)
const removeFromCart = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [req.user.id, req.params.product_id]
    );
    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart  (protected) — clear entire cart
const clearCart = async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
