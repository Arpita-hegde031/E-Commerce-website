const db = require("../config/db");

// GET /api/products  (optional ?category=women&sort=price_asc)
const getAllProducts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    // Sorting
    switch (sort) {
      case "price_asc":
        query += " ORDER BY price ASC";
        break;
      case "price_desc":
        query += " ORDER BY price DESC";
        break;
      case "rating":
        query += " ORDER BY rating DESC";
        break;
      default:
        query += " ORDER BY id ASC";
    }

    const [products] = await db.query(query, params);

    // Parse colors JSON string to array
    const parsed = products.map((p) => ({
      ...p,
      colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
    }));

    res.json({ success: true, count: parsed.length, products: parsed });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = rows[0];
    product.colors = typeof product.colors === "string"
      ? JSON.parse(product.colors)
      : product.colors;

    // Fetch related products (same category)
    const [related] = await db.query(
      "SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4",
      [product.category, product.id]
    );

    res.json({ success: true, product, related });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, original_price, category, tag, rating, reviews, image, colors, stock } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ success: false, message: "name, price, category and image are required" });
    }

    const [result] = await db.query(
      `INSERT INTO products (name, price, original_price, category, tag, rating, reviews, image, colors, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price, original_price || null, category, tag || "", rating || 0, reviews || 0,
       image, JSON.stringify(colors || []), stock || 100]
    );

    res.status(201).json({ success: true, message: "Product created", id: result.insertId });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, price, original_price, category, tag, rating, reviews, image, colors, stock } = req.body;

    await db.query(
      `UPDATE products SET name=?, price=?, original_price=?, category=?, tag=?,
       rating=?, reviews=?, image=?, colors=?, stock=? WHERE id=?`,
      [name, price, original_price || null, category, tag || "", rating, reviews,
       image, JSON.stringify(colors || []), stock, req.params.id]
    );

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllProducts, getProductById, getCategories, createProduct, updateProduct, deleteProduct };
