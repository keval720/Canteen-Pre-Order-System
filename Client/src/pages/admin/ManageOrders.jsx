import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useOrders } from "../../context/OrderContext";

const ManageOrders = () => {
  const { orders, updateOrderStatus } = useOrders();

  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    {
      name: "All",
      status: "All",
    },
    {
      name: "Pending",
      status: "Pending",
    },
    {
      name: "Preparing",
      status: "Preparing",
    },
    {
      name: "Waiting for Pickup",
      status: "Waiting for Pickup",
    },
    {
      name: "Delivered",
      status: "Delivered",
    },
  ];

  const getOrderCount = (status) => {
    if (status === "All") {
      return orders.length;
    }

    return orders.filter((order) => order.status === status).length;
  };

  const getStatusClasses = (status) => {
    if (status === "Delivered") {
      return "border-[#9be7c8] bg-[#effcf6] text-[#15966a]";
    }

    if (status === "Preparing") {
      return "border-[#bcd6ff] bg-[#f1f6ff] text-[#477be8]";
    }

    if (status === "Pending") {
      return "border-[#ffd39d] bg-[#fff8ed] text-[#e88a1a]";
    }

    return "border-[#ffd39d] bg-[#fff8ed] text-[#e88a1a]";
  };

  const getStatusDot = (status) => {
    if (status === "Delivered") {
      return "bg-[#25b982]";
    }

    if (status === "Preparing") {
      return "bg-[#477be8]";
    }

    return "bg-[#e88a1a]";
  };

  const getNextStatus = (status) => {
    if (status === "Pending") {
      return "Preparing";
    }

    if (status === "Preparing") {
      return "Waiting for Pickup";
    }

    if (status === "Waiting for Pickup") {
      return "Delivered";
    }

    return "Delivered";
  };

  const getActionText = (status) => {
    if (status === "Pending") {
      return "Mark as Preparing";
    }

    if (status === "Preparing") {
      return "Mark as Waiting for Pickup";
    }

    if (status === "Waiting for Pickup") {
      return "Mark as Delivered";
    }

    return "Completed";
  };

  const handleStatusUpdate = async (order) => {
    const nextStatus = getNextStatus(order.status);

    try {
      await updateOrderStatus(order.id, nextStatus);
    } catch (error) {
      console.error("Manage Orders Status Error:", error);
      alert("Failed to update order status.");
    }
  };

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <AdminLayout>
      <>
        <div className="min-h-screen bg-[#f9f6f1] px-4 py-5 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-semibold text-[#171717]">
              Order Management
            </h1>
          </div>

          {/* Filters */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.status}
                onClick={() => setActiveFilter(filter.status)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  activeFilter === filter.status
                    ? "border-[#d15d2c] bg-[#d15d2c] text-white"
                    : "border-[#e4d6ca] bg-white text-[#594c45] hover:border-[#d15d2c]"
                }`}
              >
                <span>{filter.name}</span>

                {filter.status !== "All" && (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                      activeFilter === filter.status
                        ? "bg-white/90 text-[#d15d2c]"
                        : "bg-[#f1e8df] text-[#d15d2c]"
                    }`}
                  >
                    {getOrderCount(filter.status)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders */}
          <div className="mt-5 space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[#e8dbd0] bg-white px-4 py-4 sm:px-5"
              >
                {/* Top Section */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Order Information */}
                  <div className="min-w-0">
                    {/* Order ID + Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-[#d15d2c]">
                        {order.orderId || order.id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${getStatusClasses(
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
                    </div>

                    {/* Customer + Time */}
                    <p className="mt-2 text-xs text-[#a17d6c]">
                      {order.customer || "Unknown"}
                      {" · "}
                      {order.date || "-"}
                      {" · Placed "}
                      {order.placedTime || "-"}
                      {" · Pickup "}
                      {order.pickupTime || "-"}
                    </p>

                    {/* Items */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items?.map((item, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-[#f1e8df] px-3 py-1.5 text-xs text-[#725f53]"
                        >
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    {/* Total */}
                    <p className="text-lg font-semibold text-[#171717]">
                      ₹{order.total || 0}
                    </p>

                    {/* Action */}
                    {order.status === "Delivered" ? (
                      <p className="flex items-center gap-1 text-xs font-medium text-[#15966a]">
                        <span>✓</span>
                        Completed
                      </p>
                    ) : (
                      <button
                        onClick={() => handleStatusUpdate(order)}
                        className="flex items-center gap-2 rounded-xl bg-[#d15d2c] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#b94f25]"
                      >
                        {getActionText(order.status)}

                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* No Orders */}
            {filteredOrders.length === 0 && (
              <div className="rounded-2xl border border-[#e8dbd0] bg-white py-12 text-center">
                <p className="text-sm text-[#8c786d]">No orders found.</p>
              </div>
            )}
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default ManageOrders;
