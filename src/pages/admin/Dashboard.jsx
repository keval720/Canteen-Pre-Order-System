import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import AdminLayout from "../../components/admin/AdminLayout";
import { useOrders } from "../../context/OrderContext";
import { subscribeToMenu } from "../../services/menuService";

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();

  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  // Real-time menu listener
  useEffect(() => {
    setMenuLoading(true);

    const unsubscribe = subscribeToMenu(
      (firebaseMenu) => {
        setMenu(firebaseMenu);
        setMenuLoading(false);
      },
      (error) => {
        console.error("Dashboard Menu Snapshot Error:", error);
        setMenuLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Derived order data
  const pendingOrders = useMemo(() => {
    return orders.filter((order) => order.status === "Pending");
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "Delivered");
  }, [orders]);

  const totalSales = useMemo(() => {
    return orders.reduce((total, order) => total + Number(order.total || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders].slice(-4).reverse();
  }, [orders]);

  const formatItems = (items) => {
    if (!items || items.length === 0) {
      return "No items";
    }

    return items
      .map(
        (item) =>
          `${item.name}${item.quantity > 1 ? ` (${item.quantity})` : ""}`,
      )
      .join(", ");
  };

  const getStatusClasses = (status) => {
    if (status === "Delivered") {
      return "border-green-200 bg-green-50 text-green-600";
    }

    if (status === "Preparing") {
      return "border-blue-200 bg-blue-50 text-blue-600";
    }

    if (status === "Pending") {
      return "border-yellow-200 bg-yellow-50 text-yellow-600";
    }

    return "border-orange-200 bg-orange-50 text-orange-600";
  };

  const getStatusDot = (status) => {
    if (status === "Delivered") {
      return "bg-green-500";
    }

    if (status === "Preparing") {
      return "bg-blue-500";
    }

    if (status === "Pending") {
      return "bg-yellow-500";
    }

    return "bg-orange-500";
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#a67867]">{currentDate}</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📋",
                value: ordersLoading ? "..." : orders.length,
                title: "Total Orders",
                description: "All orders",
                border: "border-blue-100",
                iconBg: "bg-blue-50",
              },
              {
                icon: "🕐",
                value: ordersLoading ? "..." : pendingOrders.length,
                title: "Pending",
                description: "Needs attention",
                border: "border-yellow-100",
                iconBg: "bg-yellow-50",
              },
              {
                icon: "☑️",
                value: ordersLoading ? "..." : completedOrders.length,
                title: "Completed",
                description: "Delivered orders",
                border: "border-green-100",
                iconBg: "bg-green-50",
              },
              {
                icon: "💰",
                value: ordersLoading ? "..." : `₹${totalSales}`,
                title: "Total Sales",
                description: "From all orders",
                border: "border-purple-100",
                iconBg: "bg-purple-50",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                className={`rounded-2xl border ${card.border} bg-white p-5`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} text-xl`}
                >
                  {card.icon}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                  {card.value}
                </h2>

                <p className="mt-1 text-sm text-[#a67867]">{card.title}</p>

                <p className="mt-1 text-xs text-[#c49b8c]">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd5] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfd5] px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                Recent Orders
              </h2>

              <span className="rounded-full bg-[#f1ebe5] px-3 py-1 text-xs font-medium text-[#8f7769]">
                {orders.length} total
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#faf7f3] text-left">
                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Order ID
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Items
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Total
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Pickup
                    </th>

                    <th className="px-5 py-3 text-xs font-medium text-[#a67867]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ordersLoading || recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm text-[#8f7769]"
                      >
                        {ordersLoading
                          ? "Loading orders..."
                          : "No orders found."}
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-[#eadfd5] hover:bg-[#FAF7F3]"
                      >
                        <td className="px-5 py-4 text-xs font-medium text-[#d15d2c]">
                          {order.orderId || order.id}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-900">
                          {order.customer || "Unknown"}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#8f7769]">
                          {formatItems(order.items)}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                          ₹{order.total || 0}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#8f7769]">
                          {order.pickupTime || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${getStatusClasses(
                              order.status,
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                order.status,
                              )}`}
                            />

                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Menu Availability Today */}
          <div className="mt-6 rounded-2xl border border-[#eadfd5] bg-white p-5">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Menu Availability Today
            </h2>

            {menuLoading ? (
              <div className="py-8 text-center text-sm text-[#8f7769]">
                Loading menu...
              </div>
            ) : menu.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#8f7769]">
                No menu items found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {menu.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.07,
                      ease: "easeOut",
                    }}
                    className="flex items-center justify-between rounded-xl bg-[#faf7f3] px-3 py-2"
                  >
                    <span className="text-xs text-gray-800">{item.name}</span>

                    {item.status ? (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        Unavailable
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Dashboard;
