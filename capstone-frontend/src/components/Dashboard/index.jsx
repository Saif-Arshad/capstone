import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../shared/Layout";
import logo from "/Screenshot_3.png";

function Dashboard() {
  const role = localStorage.getItem("user-role");
  const userRole = role ? role.replace(/"/g, "") : "";
  const token = localStorage.getItem("token");

  const [dashboardData, setDashboardData] = useState(null);
  console.log("🚀 ~ Dashboard ~ dashboardData:", dashboardData)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine API endpoint based on user role
  const endpoint =
    userRole === "GARAGE"
      ? `${import.meta.env.VITE_BACKEND_URL}/api/garage/dashboard`
      : userRole === "SUPPLIER" || userRole === "ADMIN"
        ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`
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
            // Send token for garage (and admin/supplier if needed)
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

  return (
    <Layout>
      <div className="container mx-auto px-4 my-8">
        <div className="bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-8 rounded-xl shadow-lg">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Link to="/">
              <img 
                src={logo} 
                alt="logo" 
                width={240} 
                height={240} 
                className="rounded-lg shadow-md"
              />
            </Link>
          </div>
          
          <h1 className="text-2xl mt-10 md:text-4xl font-bold mb-4 text-gray-800 tracking-wide">
            Welcome to Your Dashboard
          </h1>
          
          <div className="my-6">
            <p className="text-gray-600 text-center text-lg">
              This is your personal dashboard area. Here you can view and manage your information.
            </p>
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
            <div className="mt-8 w-full">
              {(userRole === "SUPPLIER" || userRole === "ADMIN") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">Average Sales Per Item</h2>
                    <p className="text-4xl text-blue-600 font-semibold">
                      {dashboardData.averageSalesPerItem.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">Net Profit</h2>
                    <p className="text-4xl text-green-600 font-semibold">
                      {dashboardData.netProfit != null
                        ? Number(dashboardData.netProfit).toFixed(2)
                        : "0.00"} AED
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">Most Selling Products</h2>
                    <ul className="space-y-3">
                      {dashboardData.mostSellingProducts.map((prod) => (
                        <li key={prod.productId} className="flex justify-between items-center border-b pb-2">
                          <span className="font-semibold capitalize text-gray-700">{prod.name}</span>
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
                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Most Bought Products</h2>
                    <ul className="space-y-3">
                      {dashboardData.mostBoughtProducts.map((prod) => (
                        <li key={prod.productId} className="flex justify-between items-center border-b pb-2">
                          <span className="font-semibold capitalize text-gray-700">{prod.name}</span>
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
                  <div className="overflow-x-auto">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Customer History</h2>
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dashboardData.customerHistory.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              {order.totalPrice} AED
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.paymentType.toUpperCase()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {`${order.address}, ${order.city}, ${order.country}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
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
