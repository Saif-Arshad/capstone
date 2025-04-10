const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    // Monthly revenue calculation
    const monthlyRevenueMap = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
      monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + order.totalPrice;
    });
    const monthlyRevenue = Object.entries(monthlyRevenueMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Order status distribution
    const statusCounts = {};
    orders.forEach((order) => {
      const status = order.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const orderStatusDistribution = Object.entries(statusCounts).map(
      ([status, count]) => ({ status, count })
    );

    // Overall statistics
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalQuantity = 0;
    const productSales = {};

    orders.forEach((order) => {
      let items = order.items;
      if (typeof items === "string") {
        try {
          items = JSON.parse(items);
        } catch (err) {
          items = [];
        }
      }
      items.forEach((item) => {
        totalRevenue += item.totalPrice;
        totalProfit += item.totalPrice * 0.1;
        totalQuantity += item.quantity;
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
      });
    });

    const distinctProductsCount = Object.keys(productSales).length;
    const averageSalesPerItem = distinctProductsCount > 0
      ? totalQuantity / distinctProductsCount
      : 0;

    // Most selling products
    const sortedSales = Object.entries(productSales)
      .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
      .slice(0, 5)
      .map(([productId, quantity]) => ({ productId, quantity }));

    const topProductIds = sortedSales.map((item) => item.productId);
    const productsData = await prisma.products.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, price: true },
    });

    const mostSellingProducts = sortedSales.map((item) => {
      const prod = productsData.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: prod ? prod.name : "Unknown",
        quantity: item.quantity,
        price: prod ? prod.price : 0
      };
    });

    return res.json({
      monthlyRevenue,
      orderStatusDistribution,
      mostSellingProducts,
      averageSalesPerItem,
      totalRevenue,
      profit: totalProfit,
      totalQuantity,
      distinctProductsCount
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return res
      .status(500)
      .json({ error: "Error fetching admin dashboard stats" });
  }
};


exports.getGarageDashboardStats = async (req, res) => {
  try {
    // Get garage ID from authenticated user (middleware should set req.user)
    const garageId = req.user.id;

    // Fetch orders placed by this garage
    const orders = await prisma.order.findMany({
      where: { userId: garageId },
    });

    // Chart 1: Monthly Orders Count
    const monthlyOrdersMap = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}`;
      monthlyOrdersMap[key] = (monthlyOrdersMap[key] || 0) + 1;
    });
    const monthlyOrders = Object.entries(monthlyOrdersMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Chart 2: Most Bought Products (from order items)
    const productSales = {};
    orders.forEach((order) => {
      let items = order.items;
      if (typeof items === "string") {
        try {
          items = JSON.parse(items);
        } catch (err) {
          items = [];
        }
      }
      items.forEach((item) => {
        const { productId, quantity } = item;
        productSales[productId] = (productSales[productId] || 0) + quantity;
      });
    });
    const sortedProductSales = Object.entries(productSales)
      .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
      .slice(0, 5)
      .map(([productId, quantity]) => ({ productId, quantity }));
    // Get product names for top bought products
    const topProductIds = sortedProductSales.map((item) => item.productId);
    const productsData = await prisma.products.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });
    const mostBoughtProducts = sortedProductSales.map((item) => {
      const prod = productsData.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: prod ? prod.name : "Unknown",
        quantity: item.quantity,
      };
    });

    const customerCounts = {};
    orders.forEach((order) => {
      // Assume order.customerId is set when an order is placed on behalf of a customer.
      const custId = order.customerId || "Unknown";
      customerCounts[custId] = (customerCounts[custId] || 0) + 1;
    });
    const customerDistribution = Object.entries(customerCounts).map(
      ([customerId, count]) => ({ customerId, count })
    );

    return res.json({
      monthlyOrders, // Chart 1
      mostBoughtProducts, // Chart 2
      customerDistribution, // Chart 3
    });
  } catch (error) {
    console.error("Error fetching garage dashboard stats:", error);
    return res
      .status(500)
      .json({ error: "Error fetching garage dashboard stats" });
  }
};
