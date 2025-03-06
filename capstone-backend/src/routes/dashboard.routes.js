const express = require("express")
const { getAdminDashboardStats, getGarageDashboardStats } = require("../controllers/dashboardStatsController")
const { verifyGarageToken } = require("../middleware/Garage.js")

const router = express.Router();

router.get("/admin/dashboard/stats", getAdminDashboardStats);

router.get("/garage/dashboard/stats", verifyGarageToken, getGarageDashboardStats);

module.exports = router;

