/******************************************************************
 *  ADMIN / SUPPLIER  DASHBOARD
 *  (route:  GET /api/dashboard/admin/dashboard/stats)
 ******************************************************************/
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAdminDashboardStats = async (req, res) => {
  try {
    /* ----------------------------------------------------------
     * 1.  Pull everything we need in two queries
     * -------------------------------------------------------- */
    const orders = await prisma.order.findMany();                  // all orders
    const allProductIds = [
      ...new Set(
        orders.flatMap((o) => {
          let items = o.items;
          if (typeof items === "string") {
            try { items = JSON.parse(items); } catch { items = []; }
          }
          return items.map((it) => it.productId);
        })
      ),
    ];

    const products = await prisma.products.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, name: true, price: true, category: true },
    });

    /* ----------------------------------------------------------
     * 2.  Scratch-pads for calcs
     * -------------------------------------------------------- */
    const fmtMonth = (d) =>
      `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}`;
    const today = new Date();
    const dayKey = (d) => d.toISOString().substring(0, 10); // YYYY-MM-DD

    const monthlyRevenueMap = {};
    const monthlyProfitMap = {};
    const monthlyOrdersMap = {};
    const dailyRevenue30Map = {};
    const statusCounts = {};
    const productQtyMap = {};
    const categoryRevenueMap = {};

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalQty = 0;

    /* ----------------------------------------------------------
     * 3.  Walk every order once
     * -------------------------------------------------------- */
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const mKey = fmtMonth(orderDate);

      /* 3a. card-level & monthly numbers -------------------- */
      monthlyOrdersMap[mKey] = (monthlyOrdersMap[mKey] || 0) + 1;
      monthlyRevenueMap[mKey] = (monthlyRevenueMap[mKey] || 0) + order.totalPrice;
      const profitForOrder = order.totalPrice * 0.1;          // 10 % margin
      monthlyProfitMap[mKey] = (monthlyProfitMap[mKey] || 0) + profitForOrder;

      totalRevenue += order.totalPrice;
      totalProfit += profitForOrder;

      /* 3b. status pie -------------------------------------- */
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

      /* 3c. daily revenue (last 30 d) ----------------------- */
      const diffDays =
        (today - orderDate) / (1000 * 60 * 60 * 24); // ms → days
      if (diffDays <= 30) {
        const dKey = dayKey(orderDate);
        dailyRevenue30Map[dKey] =
          (dailyRevenue30Map[dKey] || 0) + order.totalPrice;
      }

      /* 3d. per-item calcs --------------------------------- */
      let items = order.items;
      if (typeof items === "string") {
        try { items = JSON.parse(items); } catch { items = []; }
      }

      items.forEach((it) => {
        totalQty += it.quantity;
        productQtyMap[it.productId] =
          (productQtyMap[it.productId] || 0) + it.quantity;

        /* revenue by category – need the product’s category */
        const prod = products.find((p) => p.id === it.productId);
        const cat = prod?.category || "unclassified";
        categoryRevenueMap[cat] =
          (categoryRevenueMap[cat] || 0) + it.totalPrice;
      });
    });

    /* ----------------------------------------------------------
     * 4.  Transform helper maps → tidy arrays
     * -------------------------------------------------------- */
    const toPairArr = (obj, k1, k2) =>
      Object.entries(obj)
        .map(([k, v]) => ({ [k1]: k, [k2]: v }))
        .sort((a, b) => ("" + a[k1]).localeCompare("" + b[k1]));

    const monthlyRevenue = toPairArr(monthlyRevenueMap, "month", "revenue");
    const monthlyOrders = toPairArr(monthlyOrdersMap, "month", "count");
    const monthlyProfit = toPairArr(monthlyProfitMap, "month", "profit");
    const dailyRevenueLast30 = toPairArr(dailyRevenue30Map, "date", "revenue");
    const orderStatusDistribution = toPairArr(statusCounts, "status", "count");
    const salesByCategory = toPairArr(categoryRevenueMap, "category", "revenue");

    /* 4a.  Top-5 most-selling products ----------------------- */
    const mostSellingProducts = Object.entries(productQtyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const p = products.find((x) => x.id === productId);
        return { productId, name: p?.name || "Unknown", quantity, price: p?.price || 0 };
      });

    /* ----------------------------------------------------------
     * 5.  Cards
     * -------------------------------------------------------- */
    const distinctProductsCount = Object.keys(productQtyMap).length;
    const averageSalesPerItem =
      distinctProductsCount > 0 ? totalQty / distinctProductsCount : 0;

    /* ----------------------------------------------------------
     * 6.  Respond
     * -------------------------------------------------------- */
    return res.json({
      /* ======= 7 CHART DATASETS ======= */
      monthlyRevenue,           // Chart 1 – line / bar
      monthlyOrders,            // Chart 2 – line / bar
      monthlyProfit,            // Chart 3 – line
      dailyRevenueLast30,       // Chart 4 – line (last 30 days)
      orderStatusDistribution,  // Chart 5 – pie / doughnut
      salesByCategory,          // Chart 6 – pie / bar
      mostSellingProducts,      // Chart 7 – bar

      /* ======= 3 TOP-CARDS ======= */
      totalRevenue,
      profit: totalProfit,
      averageSalesPerItem,
    });
  } catch (err) {
    console.error("Error fetching admin dashboard stats:", err);
    return res
      .status(500)
      .json({ error: "Error fetching admin dashboard stats" });
  }
};



/******************************************************************
 *  GARAGE  DASHBOARD
 *  (route:  GET /api/dashboard/garage/dashboard/stats)
 ******************************************************************/
exports.getGarageDashboardStats = async (req, res) => {
  try {
    const garageId = req.user.id;

    /* ------------------------------------------------------ */
    const orders = await prisma.order.findMany({
      where: { userId: garageId },
    });

    const allProductIds = [
      ...new Set(
        orders.flatMap((o) => {
          let items = o.items;
          if (typeof items === "string") {
            try { items = JSON.parse(items); } catch { items = []; }
          }
          return items.map((it) => it.productId);
        })
      ),
    ];

    const products = await prisma.products.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, name: true, category: true, createdBy: true, price: true },
    });

    /* ------------------------------------------------------ */
    const fmtMonth = (d) =>
      `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}`;

    const monthlyOrdersMap = {};
    const monthlySpendingMap = {};
    const statusCounts = {};
    const productSalesMap = {};
    const customerCounts = {};
    const categorySpendMap = {};
    const supplierSpendMap = {};

    let totalSpent = 0;

    orders.forEach((order) => {
      const oDate = new Date(order.createdAt);
      const mKey = fmtMonth(oDate);

      monthlyOrdersMap[mKey] = (monthlyOrdersMap[mKey] || 0) + 1;
      monthlySpendingMap[mKey] = (monthlySpendingMap[mKey] || 0) + order.totalPrice;

      totalSpent += order.totalPrice;

      statusCounts[order.status] =
        (statusCounts[order.status] || 0) + 1;

      const customerId = order.customerId || "Unknown";
      customerCounts[customerId] =
        (customerCounts[customerId] || 0) + 1;

      let items = order.items;
      if (typeof items === "string") {
        try { items = JSON.parse(items); } catch { items = []; }
      }

      items.forEach((it) => {
        productSalesMap[it.productId] =
          (productSalesMap[it.productId] || 0) + it.quantity;

        const prod = products.find((p) => p.id === it.productId);

        const cat = prod?.category || "unclassified";
        categorySpendMap[cat] =
          (categorySpendMap[cat] || 0) + it.totalPrice;

        const supplier = prod?.createdBy || "Unknown";
        supplierSpendMap[supplier] =
          (supplierSpendMap[supplier] || 0) + it.totalPrice;
      });
    });

    /* ------------------------------------------------------ */
    const toPairArr = (obj, k1, k2) =>
      Object.entries(obj)
        .map(([k, v]) => ({ [k1]: k, [k2]: v }))
        .sort((a, b) => ("" + a[k1]).localeCompare("" + b[k1]));

    const monthlyOrders = toPairArr(monthlyOrdersMap, "month", "count");
    const monthlySpending = toPairArr(monthlySpendingMap, "month", "spending");
    const orderStatusDistribution = toPairArr(statusCounts, "status", "count");
    const customerDistribution = toPairArr(customerCounts, "customerId", "count");
    const spendingByCategory = toPairArr(categorySpendMap, "category", "spending");
    const spendingBySupplier = toPairArr(supplierSpendMap, "supplier", "spending");

    const mostBoughtProducts = Object.entries(productSalesMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const p = products.find((x) => x.id === productId);
        return { productId, name: p?.name || "Unknown", quantity };
      });

    /* ------------------------------------------------------ */
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    /* ------------------------------------------------------ */
    return res.json({
      /* ======= 7 CHART DATASETS ======= */
      monthlyOrders,           // Chart 1
      monthlySpending,         // Chart 2
      orderStatusDistribution, // Chart 3
      customerDistribution,    // Chart 4
      mostBoughtProducts,      // Chart 5
      spendingByCategory,      // Chart 6
      spendingBySupplier,      // Chart 7

      /* ======= 3 TOP-CARDS ======= */
      totalOrders,
      totalSpent,
      averageOrderValue,
    });
  } catch (err) {
    console.error("Error fetching garage dashboard stats:", err);
    return res
      .status(500)
      .json({ error: "Error fetching garage dashboard stats" });
  }
};
