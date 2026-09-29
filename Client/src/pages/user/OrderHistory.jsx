import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useOrders } from "../../context/OrderContext";

const OrderHistory = () => {
  const navigate = useNavigate();

  const { orders } = useOrders();

  const getStatusStyles = (status) => {
    if (status === "Waiting for Pickup") {
      return {
        container: "text-[#e97924] bg-[#fff8ef] border-[#ffbd78]",
        dot: "bg-[#f38a32]",
      };
    }

    if (status === "Pending") {
      return {
        container: "text-[#df9b00] bg-[#fffdf1] border-[#f4c84e]",
        dot: "bg-[#edae00]",
      };
    }

    if (status === "Preparing") {
      return {
        container: "text-[#397be7] bg-[#f1f7ff] border-[#9ec5ff]",
        dot: "bg-[#4a8bf5]",
      };
    }

    if (status === "Delivered") {
      return {
        container: "text-[#27a467] bg-[#f0fff7] border-[#9ce9bf]",
        dot: "bg-[#36b873]",
      };
    }

    return {
      container: "text-[#777] bg-[#f5f5f5] border-[#ddd]",
      dot: "bg-[#999]",
    };
  };

  const handleReorder = (order) => {
    console.log("Reordering:", order.id);
    navigate("/user/cart");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto w-full max-w-[600px] px-4 py-7 sm:px-5">
        {/* Header */}
        <h1 className="mb-6 font-serif text-[23px] text-[#1c1917]">
          Order History
        </h1>

        {/* Orders */}
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const statusStyles = getStatusStyles(order.status);

            return (
              <div
                key={order.id}
                className="min-w-0 rounded-[15px] border border-[#e2d8ce] bg-white p-4 shadow-sm"
              >
                {/* Top */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Order Information */}
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#171717]">
                      {order.id}
                    </p>

                    <p className="mt-1 break-words text-[10px] text-[#a1786b]">
                      {order.date} · {order.placedTime} · Pickup{" "}
                      {order.pickupTime}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] ${statusStyles.container}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyles.dot}`}
                    />

                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.items.map((item, index) => (
                    <span
                      key={`${order.id}-${index}`}
                      className="max-w-full rounded-full bg-[#f0eae2] px-2.5 py-1 text-[10px] text-[#806b60]"
                    >
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-[#e9dfd6]" />

                {/* Bottom */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#171717]">
                    ₹{order.total}
                  </span>

                  <button
                    onClick={() => handleReorder(order)}
                    className="flex shrink-0 items-center gap-1 rounded-xl bg-[#f0eae2] px-3 py-1.5 text-[10px] text-[#d55c29] transition hover:bg-[#e8ded3]"
                  >
                    <span className="text-base">↻</span>
                    Reorder
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-5xl text-[#cf632e]">📦</div>

            <h2 className="mt-3 font-serif text-xl text-[#1c1917]">
              No orders yet
            </h2>

            <p className="mt-2 text-xs text-[#8c8179]">
              Your orders will appear here after you place one.
            </p>

            <button
              onClick={() => navigate("/user/menu")}
              className="mt-5 rounded-xl bg-[#cf632e] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#b95222]"
            >
              Explore Menu
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
