const db = require("../config/db");

// POST /api/orders  (protected) — place order from cart
const placeOrder = async (req, res) => {
  const conn = await require("../config/db").getConnection();
  try {
    await conn.beginTransaction();

    const { payment_method, first_name, last_name, email, address, city, zip } = req.body;

    if (!first_name || !last_name || !email || !address || !city || !zip) {
      return res.status(400).json({ success: false, message: "All shipping fields are required" });
    }

    // Get cart items
    const [cartItems] = await conn.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));

    // Create order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, total_amount, shipping_amount, tax_amount,
       payment_method, first_name, last_name, email, address, city, zip, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [req.user.id, total, shipping, tax, payment_method || "card",
       first_name, last_name, email, address, city, zip]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
      // Reduce stock
      await conn.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await conn.query("DELETE FROM cart WHERE user_id = ?", [req.user.id]);

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order_id: orderId,
      total,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Place order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    conn.release();
  }
};

// GET /api/orders  (protected) — user's orders
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:id  (protected)
const getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image, p.category
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, order: orders[0], items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/all  (admin only)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders };
