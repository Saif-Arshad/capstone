const { Router } = require("express");
const router = Router();
const userRoutes = require("./user.routes")
const adminRoutes = require("./admin.routes")
const garageRoutes = require("./garage.routes")
const orderRoutes = require("./order.routes")
const brandRoutes = require("./brand.routes")
const dashboardRoutes = require("./dashboard.routes")

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/garage", garageRoutes);
router.use("/order", orderRoutes);
router.use("/brand", brandRoutes);
router.use("/dashboard", dashboardRoutes);
module.exports = router;

