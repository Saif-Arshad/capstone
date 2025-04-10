import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../shared/Layout";
import logo from "/Screenshot_3.png";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Set global chart defaults
import { defaults } from "chart.js/auto";
defaults.maintainAspectRatio = false;
defaults.responsive = true;

// Define your custom color palette
const pink = "#fa8397";
const green = "#6ae56a";
const yellow = "#e7e75f";
const lightBlue = "#ADD8E6";
const customColors = [pink, green, yellow, lightBlue];

function Dashboard() {
  const role = localStorage.getItem("user-role");
  const userRole = role ? role.replace(/"/g, "") : "";
  const token = localStorage.getItem("token");

  const [dashboardData, setDashboardData] = useState(null);
  console.log("🚀 ~ Dashboard ~ dashboardData:", dashboardData)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine API endpoint based on role
  const endpoint =
    userRole === "GARAGE"
      ? `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/garage/dashboard/stats`
      : userRole === "SUPPLIER" || userRole === "ADMIN"
        ? `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/admin/dashboard/stats`
        : null;

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [endpoint, token]);

  // --- Chart data for Admin/Supplier ---
  let monthlyRevenueChartData, orderStatusChartData, mostSellingProductsChartData;
  if (dashboardData && (userRole === "SUPPLIER" || userRole === "ADMIN")) {
    monthlyRevenueChartData = {
      labels: dashboardData.monthlyRevenue
        ? dashboardData.monthlyRevenue.map((item) => item.month)
        : [],
      datasets: [
        {
          label: "Revenue (AED)",
          data: dashboardData.monthlyRevenue
            ? dashboardData.monthlyRevenue.map((item) => item.revenue)
            : [],
          backgroundColor: dashboardData.monthlyRevenue
            ? dashboardData.monthlyRevenue.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };

    orderStatusChartData = {
      labels: dashboardData.orderStatusDistribution
        ? dashboardData.orderStatusDistribution.map((item) => item.status)
        : [],
      datasets: [
        {
          label: "Order Count",
          data: dashboardData.orderStatusDistribution
            ? dashboardData.orderStatusDistribution.map((item) => item.count)
            : [],
          backgroundColor: dashboardData.orderStatusDistribution
            ? dashboardData.orderStatusDistribution.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };

    mostSellingProductsChartData = {
      labels: dashboardData.mostSellingProducts
        ? dashboardData.mostSellingProducts.map((item) => item.name)
        : [],
      datasets: [
        {
          label: "Quantity Sold",
          data: dashboardData.mostSellingProducts
            ? dashboardData.mostSellingProducts.map((item) => item.quantity)
            : [],
          backgroundColor: dashboardData.mostSellingProducts
            ? dashboardData.mostSellingProducts.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };
  }

  // --- Chart data for Garage ---
  let monthlyOrdersChartData, mostBoughtProductsChartData, customerDistributionChartData;
  if (dashboardData && userRole === "GARAGE") {
    monthlyOrdersChartData = {
      labels: dashboardData.monthlyOrders
        ? dashboardData.monthlyOrders.map((item) => item.month)
        : [],
      datasets: [
        {
          label: "Orders Count",
          data: dashboardData.monthlyOrders
            ? dashboardData.monthlyOrders.map((item) => item.count)
            : [],
          backgroundColor: dashboardData.monthlyOrders
            ? dashboardData.monthlyOrders.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };

    mostBoughtProductsChartData = {
      labels: dashboardData.mostBoughtProducts
        ? dashboardData.mostBoughtProducts.map((item) => item.name)
        : [],
      datasets: [
        {
          label: "Quantity Bought",
          data: dashboardData.mostBoughtProducts
            ? dashboardData.mostBoughtProducts.map((item) => item.quantity)
            : [],
          backgroundColor: dashboardData.mostBoughtProducts
            ? dashboardData.mostBoughtProducts.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };

    customerDistributionChartData = {
      labels: dashboardData.customerDistribution
        ? dashboardData.customerDistribution.map((item) => item.customerId)
        : [],
      datasets: [
        {
          label: "Orders by Customer",
          data: dashboardData.customerDistribution
            ? dashboardData.customerDistribution.map((item) => item.count)
            : [],
          backgroundColor: dashboardData.customerDistribution
            ? dashboardData.customerDistribution.map((_, idx) => customColors[idx % customColors.length])
            : [],
        },
      ],
    };
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 my-8">
        <div className=" flex flex-col items-center justify-center p-8 rounded-xl">
          <div className="transform hover:scale-105 mb-10 transition-transform duration-300">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                width={240}
                height={240}
                className="rounded-lg"
              />
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 animate-pulse">
              <p className="text-blue-600">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : dashboardData ? (
            <>
              {/* Existing Cards Section */}
              {(userRole === "SUPPLIER" || userRole === "ADMIN") && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-8 w-full pt-20">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                      Average Sales Per Item
                    </h2>
                    <p className="text-4xl text-blue-600 font-semibold">
                      {dashboardData.averageSalesPerItem
                        ? Number(dashboardData.averageSalesPerItem).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                          Total Revenue
                    </h2>
                    <p className="text-4xl text-blue-600 font-semibold">
                          {dashboardData.totalRevenue
                            ? Number(dashboardData.totalRevenue).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                      Net Profit
                    </h2>
                    <p className="text-4xl text-green-600 font-semibold">
                          {dashboardData.profit != null
                            ? Number(dashboardData.profit).toFixed(2)
                        : "0.00"}{" "}
                      AED
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                      Most Selling Products
                    </h2>
                    <ul className="space-y-3">
                      {dashboardData.mostSellingProducts &&
                        dashboardData.mostSellingProducts.map((prod) => (
                          <li
                            key={prod.productId}
                            className="flex justify-between items-center pb-2"
                          >
                            <span className="font-semibold capitalize text-gray-700">
                              {prod.name}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {prod.quantity} sold
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
              {userRole === "GARAGE" && (
                <div className="w-full pb-20 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-start mb-6 text-gray-800">
                      Most Bought Products
                    </h2>
                    <ul className="space-y-3">
                      {dashboardData.mostBoughtProducts &&
                        dashboardData.mostBoughtProducts.map((prod) => (
                          <li
                            key={prod.productId}
                            className="flex justify-between items-center pb-2"
                          >
                            <span className="font-semibold capitalize text-gray-700">
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-600">{prod.price} AED</span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {prod.quantity} bought
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                
                </div>
              )}

              {/* New Charts Section */}
              {(userRole === "SUPPLIER" || userRole === "ADMIN") && dashboardData.monthlyRevenue && (
                <div className="pt-12 w-full">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Monthly Revenue
                      </h3>
                      <Bar
                        data={monthlyRevenueChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "top" } },
                        }}
                      />
                    </div>
                    <div className="bg-gray-50 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Order Status Distribution
                      </h3>
                      <Pie
                        data={orderStatusChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "bottom" } },
                        }}
                      />
                    </div>
                    <div className="bg-gray-50 xl:col-span-2 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Most Selling Products
                      </h3>
                      <Bar
                        data={mostSellingProductsChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "top" } },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {userRole === "GARAGE" && dashboardData.monthlyOrders && (
                <div className="mt-12 w-full">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Monthly Orders
                      </h3>
                      <Bar
                        data={monthlyOrdersChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "top" } },
                        }}
                      />
                    </div>
                    <div className="bg-gray-50 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Customer Distribution
                      </h3>
                      <Pie
                        data={customerDistributionChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "bottom" } },
                        }}
                      />
                    </div>
                    <div className="bg-gray-50 xl:col-span-2 p-6 h-[350px] rounded-xl shadow-md">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Most Bought Products
                      </h3>
                      <Bar
                        data={mostBoughtProductsChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { position: "top" } },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-600">No dashboard data available.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
