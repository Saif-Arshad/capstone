import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Layout from "../shared/Layout";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import jsPDF from "jspdf";
// 👉 switched to the oklch‑compatible fork
import html2canvas from "html2canvas-pro";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

import { defaults } from "chart.js/auto";
defaults.maintainAspectRatio = false;
defaults.responsive = true;

// Tailwind-friendly palette
const palette = [
  "#fa8397",
  "#6ae56a",
  "#e7e75f",
  "#8cc4ff",
  "#ffa08c",
  "#bb86fc",
  "#ffcc80",
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

function useDashboardData(endpoint, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, token]);

  return { data, loading, error };
}

function buildLineDataset(label, data) {
  return {
    label,
    data,
    borderWidth: 2,
    borderColor: palette[0],
    backgroundColor: "rgba(0,0,0,0)",
    tension: 0.4,
  };
}

function buildBarDataset(label, data, colorIdx = 1) {
  return {
    label,
    data,
    backgroundColor: palette[colorIdx % palette.length],
    borderRadius: 4,
  };
}

function Dashboard() {
  const dashboardRef = useRef(null);
  const buttonRef = useRef(null);

  const [isExporting, setIsExporting] = useState(false);

  const rawRole = localStorage.getItem("user-role") || "";
  const userRole = rawRole.replace(/"/g, "");
  const token = localStorage.getItem("token");

  const endpoint =
    userRole === "GARAGE"
      ? `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/garage/dashboard/stats`
      : userRole === "SUPPLIER" || userRole === "ADMIN"
        ? `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/admin/dashboard/stats`
        : null;

  const { data, loading, error } = useDashboardData(endpoint, token);

  // === Memoized chart configs ===
  const charts = useMemo(() => {
    if (!data) return {};
    const makeLabels = (arr, key) => arr.map((x) => x[key]);
    const makeValues = (arr, key) => arr.map((x) => x[key]);

    if (userRole === "SUPPLIER" || userRole === "ADMIN") {
      return {
        monthlyRevenue: {
          labels: makeLabels(data.monthlyRevenue, "month"),
          datasets: [buildLineDataset("Revenue (AED)", makeValues(data.monthlyRevenue, "revenue"))],
        },
        monthlyOrders: {
          labels: makeLabels(data.monthlyOrders, "month"),
          datasets: [buildLineDataset("Orders", makeValues(data.monthlyOrders, "count"))],
        },
        monthlyProfit: {
          labels: makeLabels(data.monthlyProfit, "month"),
          datasets: [buildLineDataset("Profit", makeValues(data.monthlyProfit, "profit"))],
        },
        dailyRevenueLast30: {
          labels: makeLabels(data.dailyRevenueLast30, "date"),
          datasets: [buildLineDataset("Daily Revenue", makeValues(data.dailyRevenueLast30, "revenue"))],
        },
        orderStatusDistribution: {
          labels: makeLabels(data.orderStatusDistribution, "status"),
          datasets: [
            {
              data: makeValues(data.orderStatusDistribution, "count"),
              backgroundColor: palette,
            },
          ],
        },
        salesByCategory: {
          labels: makeLabels(data.salesByCategory, "category"),
          datasets: [buildBarDataset("Revenue", makeValues(data.salesByCategory, "revenue"), 2)],
        },
        mostSellingProducts: {
          labels: makeLabels(data.mostSellingProducts, "name"),
          datasets: [buildBarDataset("Quantity", makeValues(data.mostSellingProducts, "quantity"), 3)],
        },
      };
    }

    if (userRole === "GARAGE") {
      return {
        monthlyOrders: {
          labels: makeLabels(data.monthlyOrders, "month"),
          datasets: [buildLineDataset("Orders", makeValues(data.monthlyOrders, "count"))],
        },
        monthlySpending: {
          labels: makeLabels(data.monthlySpending, "month"),
          datasets: [buildLineDataset("Spending (AED)", makeValues(data.monthlySpending, "spending"))],
        },
        orderStatusDistribution: {
          labels: makeLabels(data.orderStatusDistribution, "status"),
          datasets: [
            {
              data: makeValues(data.orderStatusDistribution, "count"),
              backgroundColor: palette,
            },
          ],
        },
        customerDistribution: {
          labels: makeLabels(data.customerDistribution, "customerId"),
          datasets: [
            {
              data: makeValues(data.customerDistribution, "count"),
              backgroundColor: palette,
            },
          ],
        },
        mostBoughtProducts: {
          labels: makeLabels(data.mostBoughtProducts, "name"),
          datasets: [buildBarDataset("Quantity", makeValues(data.mostBoughtProducts, "quantity"), 4)],
        },
        spendingByCategory: {
          labels: makeLabels(data.spendingByCategory, "category"),
          datasets: [buildBarDataset("Spending", makeValues(data.spendingByCategory, "spending"), 5)],
        },
        spendingBySupplier: {
          labels: makeLabels(data.spendingBySupplier, "supplier"),
          datasets: [buildBarDataset("Spending", makeValues(data.spendingBySupplier, "spending"), 6)],
        },
      };
    }
    return {};
  }, [data, userRole]);

  // === Cards ===
  const cards = useMemo(() => {
    if (!data) return [];
    if (userRole === "SUPPLIER" || userRole === "ADMIN") {
      return [
        {
          title: "Average Sales / Item",
          value: Number(data.averageSalesPerItem || 0).toFixed(2),
          suffix: "",
        },
        {
          title: "Total Revenue",
          value: Number(data.totalRevenue || 0).toLocaleString(),
          suffix: " AED",
        },
        {
          title: "Net Profit",
          value: Number(data.profit || 0).toLocaleString(),
          suffix: " AED",
        },
      ];
    }
    if (userRole === "GARAGE") {
      return [
        {
          title: "Total Orders",
          value: data.totalOrders || 0,
        },
        {
          title: "Total Spent",
          value: Number(data.totalSpent || 0).toLocaleString(),
          suffix: " AED",
        },
        {
          title: "Avg. Order Value",
          value: Number(data.averageOrderValue || 0).toFixed(2),
          suffix: " AED",
        },
      ];
    }
    return [];
  }, [data, userRole]);

  // === Export to PDF ===
  const handleExport = () => {
    if (isExporting) return; // guard against double clicks
    setIsExporting(true);

    const button = buttonRef.current;
    const container = dashboardRef.current;
    if (!container || !button) {
      setIsExporting(false);
      return;
    }

    html2canvas(container, {
      scale: 2,
      useCORS: true,
      ignoreElements: (el) => el === button, // exclude the button instead of display:none
    })
      .then((canvas) => {
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        const totalPages = Math.ceil(imgHeight / pdfHeight);

        // Add title and timestamp on the first page
        pdf.setFontSize(16);
        pdf.text(`${userRole} Dashboard Report`, 40, 40);
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60);

        // Adjust image position to account for title
        const topMargin = 80;
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();
          const yOffset = topMargin - i * pdfHeight;
          pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
        }

        pdf.save(`Detail.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  // === Render ===
  return (
    <Layout>
      <div ref={dashboardRef} className="container mx-auto px-4 pb-8">
        <div className="flex justify-end pb-6">
          <button
            ref={buttonRef}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <svg
                className="animate-spin w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            )}
            {isExporting ? "Exporting…" : "Export Detail"}
          </button>
        </div>

        {loading && (
          <p className="text-blue-600 text-center animate-pulse">Loading dashboard…</p>
        )}
        {error && (
          <p className="text-red-600 text-center bg-red-50 p-4 rounded-lg border">{error}</p>
        )}
        {!loading && !error && !data && (
          <p className="text-yellow-700 text-center">No dashboard data available.</p>
        )}

        {/* ===== CARDS ===== */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {cards.map((c, idx) => (
              <motion.div
                key={c.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-lg"
              >
                <h3 className="text-gray-600 text-sm font-medium mb-1 uppercase tracking-wide">
                  {c.title}
                </h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {c.value}
                  {c.suffix}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== CHARTS ===== */}
        {data && (
          <section className="space-y-12">
            {Object.entries(charts).map(([key, chartData]) => (
              <motion.div
                key={key}
                className="bg-white rounded-2xl shadow p-6 border border-gray-100"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-4 capitalize text-gray-700">
                  {key.replace(/([A-Z])/g, " $1").replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
                <div className="h-[350px]">
                  {(() => {
                    if (key.includes("Distribution"))
                      return <Pie data={chartData} options={{ plugins: { legend: { position: "bottom" } } }} />;
                    if (key.includes("most") || key.includes("salesBy") || key.includes("spending"))
                      return <Bar data={chartData} options={{ plugins: { legend: { position: "top" } } }} />;
                    return <Line data={chartData} options={{ plugins: { legend: { position: "top" } }, tension: 0.4 }} />;
                  })()}
                </div>
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
