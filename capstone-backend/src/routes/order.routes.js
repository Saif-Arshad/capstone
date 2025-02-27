const express = require("express");
const ordercontrollers = require("../controllers/order.controller"); // path to the file above
const { verifyUser } = require("../middleware/Garage");
const router = express.Router();



router.post("/create", verifyUser, ordercontrollers.createOrder);
router.get("/", ordercontrollers.getAllOrders);
router.put("/update/:id", ordercontrollers.updateOrderStatus);
router.get("/my", verifyUser, ordercontrollers.getMyOrders);
router.get("/:id", ordercontrollers.getOrderById);

module.exports = router;
