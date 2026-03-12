const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, getAllOrders } = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.use(verifyToken);

router.post("/",        placeOrder);
router.get("/",         getMyOrders);
router.get("/all",      verifyAdmin, getAllOrders);
router.get("/:id",      getOrderById);

module.exports = router;
