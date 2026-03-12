const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart",     require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// ── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "VOGUEX API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth:     "/api/auth",
      products: "/api/products",
      cart:     "/api/cart",
      orders:   "/api/orders",
      wishlist: "/api/wishlist",
    },
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 VOGUEX server running on http://localhost:${PORT}`);
});
