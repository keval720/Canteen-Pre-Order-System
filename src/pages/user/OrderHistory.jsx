import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import FeedbackForm from "../../components/user/FeedbackForm";

import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const OrderHistory = () => {
  const navigate = useNavigate();

  const { orders } = useOrders();
  const { user } = useAuth();
  const { reorderItems } = useCart();

  const [reorderingOrderId, setReorderingOrderId] = useState(null);

  // ==========================================
  // FEEDBACK
  // ==========================================

  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [submittedFeedbackOrderIds, setSubmittedFeedbackOrderIds] = useState(
    [],
  );

  const userOrders = useMemo(() => {
    if (!user) {
      return [];
    }

    return [...orders]
      .filter((order) => order.userId === user.uid)
      .sort((a, b) => {
        const timeA = a.createdAt?.toMillis
          ? a.createdAt.toMillis()
          : new Date(a.createdAt || 0).getTime();

        const timeB = b.createdAt?.toMillis
          ? b.createdAt.toMillis()
          : new Date(b.createdAt || 0).getTime();

        return timeB - timeA;
      });
  }, [orders, user]);

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

  // ==========================================
  // REORDER
  // ==========================================

  const handleReorder = async (order) => {
    if (!order.items?.length) {
      alert("This order has no items to reorder.");
      return;
    }

    try {
      setReorderingOrderId(order.id);

      await reorderItems(order.items);

      navigate("/user/cart");
    } catch (error) {
      console.error("Reorder Error:", error);

      alert(error.message || "Unable to reorder this order.");
    } finally {
      setReorderingOrderId(null);
    }
  };

  // ==========================================
  // OPEN ORDER
  // ==========================================

  const handleOrderClick = (order) => {
    navigate("/user/order-success", {
      state: {
        orderId: order.id,
      },
    });
  };

  // ==========================================
  // OPEN FEEDBACK
  // ==========================================

  const handleOpenFeedback = (order) => {
    if (order.status !== "Delivered") {
      return;
    }

    if (submittedFeedbackOrderIds.includes(order.id)) {
      return;
    }

    setFeedbackOrder(order);
  };

  // ==========================================
  // FEEDBACK SUBMITTED
  // ==========================================

  const handleFeedbackSubmitted = () => {
    if (!feedbackOrder) {
      return;
    }

    setSubmittedFeedbackOrderIds((previous) => [...previous, feedbackOrder.id]);

    setFeedbackOrder(null);
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
          {userOrders.map((order, index) => {
            const statusStyles = getStatusStyles(order.status);

            const isReordering = reorderingOrderId === order.id;

            const hasSubmittedFeedback = submittedFeedbackOrderIds.includes(
              order.id,
            );

            const canGiveFeedback =
              order.status === "Delivered" && !hasSubmittedFeedback;

            return (
              <motion.div
                key={order.id}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                onClick={() => handleOrderClick(order)}
                className="min-w-0 cursor-pointer rounded-[15px] border border-[#e2d8ce] bg-white p-4 shadow-sm transition hover:shadow-md"
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
                  {order.items?.map((item, itemIndex) => (
                    <span
                      key={`${order.id}-${itemIndex}`}
                      className="max-w-full rounded-full bg-[#f0eae2] px-2.5 py-1 text-[10px] text-[#806b60]"
                    >
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-[#e9dfd6]" />

                {/* Bottom */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#171717]">
                    ₹{order.total}
                  </span>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {/* Reorder */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleReorder(order);
                      }}
                      disabled={reorderingOrderId !== null}
                      className="flex shrink-0 items-center gap-1 rounded-xl bg-[#f0eae2] px-3 py-1.5 text-[10px] text-[#d55c29] transition hover:bg-[#e8ded3] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="text-base">
                        {isReordering ? "..." : "↻"}
                      </span>

                      {isReordering ? "Adding..." : "Reorder"}
                    </button>

                    {/* Give Feedback */}
                    {canGiveFeedback && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenFeedback(order);
                        }}
                        className="flex shrink-0 items-center gap-1 rounded-xl bg-[#d15d2c] px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-[#b95222]"
                      >
                        <span className="text-sm">★</span>
                        Give Feedback
                      </button>
                    )}

                    {/* Feedback Submitted */}
                    {hasSubmittedFeedback && (
                      <span className="flex shrink-0 items-center gap-1 rounded-xl bg-[#f0fff7] px-3 py-1.5 text-[10px] font-medium text-[#27a467]">
                        <span>✓</span>
                        Feedback Submitted
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {userOrders.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-5xl text-[#cf632e]">📦</div>

            <h2 className="mt-3 font-serif text-xl text-[#1c1917]">
              No orders yet
            </h2>

            <p className="mt-2 text-xs text-[#8c8179]">
              Your orders will appear here after you place one.
            </p>

            <button
              type="button"
              onClick={() => navigate("/user/menu")}
              className="mt-5 rounded-xl bg-[#cf632e] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#b95222]"
            >
              Explore Menu
            </button>
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      {feedbackOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
          onClick={() => setFeedbackOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <FeedbackForm
              order={feedbackOrder}
              onSubmitted={handleFeedbackSubmitted}
              onCancel={() => setFeedbackOrder(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
