import { useMemo, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import { useOrders } from "../../context/OrderContext";

const ManageOrders = () => {
  const { orders, updateOrderStatus, markOrderAsCollected } = useOrders();

  const [activeFilter, setActiveFilter] = useState("All");

  // Pickup code verification
  const [pickupCode, setPickupCode] = useState("");
  const [pickupOrder, setPickupOrder] = useState(null);
  const [pickupError, setPickupError] = useState("");
  const [pickupMessage, setPickupMessage] = useState("");
  const [collecting, setCollecting] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Lost code verification
  const [showAlternativeVerification, setShowAlternativeVerification] =
    useState(false);

  const [paymentId, setPaymentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [alternativeOrder, setAlternativeOrder] = useState(null);
  const [alternativeError, setAlternativeError] = useState("");
  const [alternativeMessage, setAlternativeMessage] = useState("");
  const [alternativeCollecting, setAlternativeCollecting] = useState(false);

  // Smart Kitchen Batching
  const [ignoredBatchSuggestions, setIgnoredBatchSuggestions] = useState([]);

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

    return status;
  };

  const getActionText = (status) => {
    if (status === "Pending") {
      return "Mark as Preparing";
    }

    if (status === "Preparing") {
      return "Mark as Waiting for Pickup";
    }

    return "Completed";
  };

  const handleStatusUpdate = async (order) => {
    const nextStatus = getNextStatus(order.status);

    if (order.status === "Waiting for Pickup") {
      return;
    }

    if (updatingOrderId) {
      return;
    }

    try {
      setUpdatingOrderId(order.id);

      await updateOrderStatus(order.id, nextStatus);
    } catch (error) {
      console.error("Manage Orders Status Error:", error);

      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // -----------------------------
  // Smart Kitchen Batch Detection
  // -----------------------------

  const batchSuggestions = useMemo(() => {
    const activeStatuses = ["Pending", "Preparing", "Waiting for Pickup"];

    const activeOrders = orders.filter(
      (order) =>
        activeStatuses.includes(order.status) &&
        Array.isArray(order.items) &&
        order.items.length > 0,
    );

    const suggestions = [];

    for (
      let firstIndex = 0;
      firstIndex < activeOrders.length;
      firstIndex += 1
    ) {
      const firstOrder = activeOrders[firstIndex];

      for (
        let secondIndex = firstIndex + 1;
        secondIndex < activeOrders.length;
        secondIndex += 1
      ) {
        const secondOrder = activeOrders[secondIndex];

        const commonItems = [];

        firstOrder.items.forEach((firstItem) => {
          const secondItem = secondOrder.items.find(
            (item) => item.id === firstItem.id,
          );

          if (
            secondItem &&
            firstItem.batchable === true &&
            secondItem.batchable === true
          ) {
            const firstQuantity = Number(firstItem.quantity || 0);

            const secondQuantity = Number(secondItem.quantity || 0);

            const totalQuantity = firstQuantity + secondQuantity;

            if (totalQuantity > 0) {
              commonItems.push({
                id: firstItem.id,
                name: firstItem.name,
                quantity: totalQuantity,
              });
            }
          }
        });

        if (commonItems.length === 0) {
          continue;
        }

        const orderIds = [firstOrder.id, secondOrder.id].sort();

        const suggestionId = orderIds.join("-");

        if (ignoredBatchSuggestions.includes(suggestionId)) {
          continue;
        }

        suggestions.push({
          id: suggestionId,
          orders: [firstOrder, secondOrder],
          commonItems,
        });
      }
    }

    return suggestions;
  }, [orders, ignoredBatchSuggestions]);

  const handleIgnoreBatchSuggestion = (suggestionId) => {
    setIgnoredBatchSuggestions((previousSuggestions) => [
      ...previousSuggestions,
      suggestionId,
    ]);
  };

  // -----------------------------
  // Pickup Code Verification
  // -----------------------------

  const handlePickupCodeChange = (event) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    setPickupCode(value);

    setPickupOrder(null);
    setPickupError("");
    setPickupMessage("");
  };

  const handleVerifyPickupCode = () => {
    setPickupError("");
    setPickupMessage("");
    setPickupOrder(null);

    const enteredCode = pickupCode.trim().toUpperCase();

    if (!enteredCode) {
      setPickupError("Please enter the pickup code.");

      return;
    }

    if (enteredCode.length !== 6) {
      setPickupError("Pickup code must contain 6 characters.");

      return;
    }

    const matchedOrder = orders.find(
      (order) => order.pickupCode?.toUpperCase() === enteredCode,
    );

    if (!matchedOrder) {
      setPickupError("Invalid pickup code. No matching order found.");

      return;
    }

    if (matchedOrder.paymentStatus !== "paid") {
      setPickupError("This order does not have a successful payment.");

      return;
    }

    if (matchedOrder.pickupStatus === "collected") {
      setPickupError("This order has already been collected.");

      return;
    }

    if (matchedOrder.status !== "Waiting for Pickup") {
      setPickupError("This order is not ready for pickup yet.");

      return;
    }

    setPickupOrder(matchedOrder);
  };

  // -----------------------------
  // Mark Normal Pickup Collected
  // -----------------------------

  const handleMarkAsCollected = async () => {
    if (!pickupOrder) {
      return;
    }

    try {
      setCollecting(true);
      setPickupError("");
      setPickupMessage("");

      await markOrderAsCollected(pickupOrder.id);

      setPickupOrder(null);

      setPickupMessage("Order successfully marked as collected.");

      setPickupCode("");
    } catch (error) {
      console.error("Mark Order Collected Error:", error);

      setPickupError("Failed to mark the order as collected.");
    } finally {
      setCollecting(false);
    }
  };

  // -----------------------------
  // Alternative Verification
  // -----------------------------

  const handleAlternativeVerification = () => {
    setAlternativeError("");
    setAlternativeMessage("");
    setAlternativeOrder(null);

    const enteredPaymentId = paymentId.trim();

    const enteredEmail = customerEmail.trim().toLowerCase();

    if (!enteredPaymentId) {
      setAlternativeError("Please enter the payment ID.");

      return;
    }

    if (!enteredEmail) {
      setAlternativeError("Please enter the customer's email.");

      return;
    }

    const matchedOrder = orders.find(
      (order) =>
        order.razorpayPaymentId === enteredPaymentId &&
        order.customerEmail?.toLowerCase() === enteredEmail,
    );

    if (!matchedOrder) {
      setAlternativeError(
        "No matching paid order found. Please check the payment ID and email.",
      );

      return;
    }

    if (matchedOrder.paymentStatus !== "paid") {
      setAlternativeError("This order does not have a successful payment.");

      return;
    }

    if (matchedOrder.pickupStatus === "collected") {
      setAlternativeError("This order has already been collected.");

      return;
    }

    if (matchedOrder.status !== "Waiting for Pickup") {
      setAlternativeError("This order is not ready for pickup yet.");

      return;
    }

    setAlternativeOrder(matchedOrder);
  };

  // -----------------------------
  // Alternative Collection
  // -----------------------------

  const handleAlternativeCollection = async () => {
    if (!alternativeOrder) {
      return;
    }

    try {
      setAlternativeCollecting(true);
      setAlternativeError("");
      setAlternativeMessage("");

      await markOrderAsCollected(alternativeOrder.id);

      setAlternativeOrder((previousOrder) => ({
        ...previousOrder,
        status: "Delivered",
        pickupStatus: "collected",
      }));

      setAlternativeMessage("Order successfully verified and collected.");

      setPaymentId("");
      setCustomerEmail("");
    } catch (error) {
      console.error("Alternative Collection Error:", error);

      setAlternativeError("Failed to mark the order as collected.");
    } finally {
      setAlternativeCollecting(false);
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

            <p className="mt-1 text-sm text-[#8c786d]">
              Manage orders and verify pickup codes.
            </p>
          </div>

          {/* Pickup Verification */}
          <div className="mt-5 rounded-2xl border border-[#e8dbd0] bg-white p-4 sm:p-5">
            <div>
              <h2 className="text-base font-semibold text-[#171717]">
                Verify Pickup Code
              </h2>

              <p className="mt-1 text-xs text-[#8c786d]">
                Enter the 6-character code provided by the customer.
              </p>
            </div>

            {/* Pickup Code */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={pickupCode}
                onChange={handlePickupCodeChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleVerifyPickupCode();
                  }
                }}
                placeholder="Enter pickup code"
                maxLength={6}
                className="h-11 w-full rounded-xl border border-[#dfd2c7] bg-[#fffdfb] px-4 text-sm font-semibold uppercase tracking-[3px] text-[#171717] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#b3a59c] focus:border-[#d15d2c] sm:max-w-[300px]"
              />

              <button
                type="button"
                onClick={handleVerifyPickupCode}
                className="h-11 rounded-xl bg-[#d15d2c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b94f25]"
              >
                Verify Code
              </button>
            </div>

            {/* Pickup Error */}
            {pickupError && (
              <div className="mt-4 rounded-xl border border-[#f0b9ad] bg-[#fff3f0] px-4 py-3">
                <p className="text-xs font-medium text-[#d94f3d]">
                  {pickupError}
                </p>
              </div>
            )}

            {/* Pickup Message */}
            {pickupMessage && (
              <div className="mt-4 rounded-xl border border-[#9be7c8] bg-[#effcf6] px-4 py-3">
                <p className="text-xs font-medium text-[#15966a]">
                  {pickupMessage}
                </p>
              </div>
            )}

            {/* Matched Pickup Order */}
            {pickupOrder && (
              <div className="mt-4 rounded-xl border border-[#e8dbd0] bg-[#fffaf6] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a17d6c]">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#171717]">
                      {pickupOrder.customer || "Unknown"}
                    </p>

                    <p className="mt-1 break-all text-xs text-[#8c786d]">
                      {pickupOrder.customerEmail || "-"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                      pickupOrder.status,
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                        pickupOrder.status,
                      )}`}
                    />

                    {pickupOrder.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-3 py-3">
                    <p className="text-[10px] text-[#a17d6c]">Order ID</p>

                    <p className="mt-1 break-all text-xs font-medium text-[#171717]">
                      {pickupOrder.orderId || pickupOrder.id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-3 py-3">
                    <p className="text-[10px] text-[#a17d6c]">Pickup Time</p>

                    <p className="mt-1 text-xs font-semibold text-[#d15d2c]">
                      {pickupOrder.pickupTime || pickupOrder.pickupSlot || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-3 py-3">
                    <p className="text-[10px] text-[#a17d6c]">Total</p>

                    <p className="mt-1 text-xs font-semibold text-[#171717]">
                      ₹{pickupOrder.total || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a17d6c]">
                    Items
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {pickupOrder.items?.map((item, index) => (
                      <span
                        key={`${item.id || item.name}-${index}`}
                        className="rounded-full bg-[#f1e8df] px-3 py-1.5 text-xs text-[#725f53]"
                      >
                        {item.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#eadfd6] pt-4">
                  <button
                    type="button"
                    onClick={handleMarkAsCollected}
                    disabled={collecting}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors sm:w-auto ${
                      collecting
                        ? "cursor-not-allowed bg-[#c8bbb2]"
                        : "bg-[#15966a] hover:bg-[#12845c]"
                    }`}
                  >
                    {collecting ? "Updating..." : "Mark as Collected"}
                  </button>
                </div>
              </div>
            )}

            {/* Lost Code */}
            <div className="mt-5 border-t border-[#eadfd6] pt-5">
              <button
                type="button"
                onClick={() => {
                  setShowAlternativeVerification((previous) => !previous);

                  setAlternativeError("");
                  setAlternativeMessage("");
                  setAlternativeOrder(null);
                }}
                className="text-xs font-semibold text-[#d15d2c] hover:underline"
              >
                {showAlternativeVerification
                  ? "Hide alternative verification"
                  : "Customer lost the pickup code?"}
              </button>
            </div>

            {/* Alternative Verification */}
            {showAlternativeVerification && (
              <div className="mt-4 rounded-xl border border-[#e8dbd0] bg-[#fffaf6] p-4">
                <h3 className="text-sm font-semibold text-[#171717]">
                  Alternative Verification
                </h3>

                <p className="mt-1 text-xs leading-[1.5] text-[#8c786d]">
                  Use the payment ID and registered customer email to find the
                  order.
                </p>

                {/* Payment ID */}
                <div className="mt-4">
                  <label className="text-xs font-medium text-[#594c45]">
                    Payment ID
                  </label>

                  <input
                    type="text"
                    value={paymentId}
                    onChange={(event) => setPaymentId(event.target.value)}
                    placeholder="Enter Razorpay payment ID"
                    className="mt-1 h-11 w-full rounded-xl border border-[#dfd2c7] bg-white px-4 text-xs text-[#171717] outline-none focus:border-[#d15d2c]"
                  />
                </div>

                {/* Email */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-[#594c45]">
                    Customer Email
                  </label>

                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="Enter registered email"
                    className="mt-1 h-11 w-full rounded-xl border border-[#dfd2c7] bg-white px-4 text-xs text-[#171717] outline-none focus:border-[#d15d2c]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAlternativeVerification}
                  className="mt-4 rounded-xl bg-[#d15d2c] px-5 py-3 text-xs font-semibold text-white hover:bg-[#b94f25]"
                >
                  Find Order
                </button>

                {/* Alternative Error */}
                {alternativeError && (
                  <div className="mt-4 rounded-xl border border-[#f0b9ad] bg-[#fff3f0] px-4 py-3">
                    <p className="text-xs font-medium text-[#d94f3d]">
                      {alternativeError}
                    </p>
                  </div>
                )}

                {/* Alternative Success */}
                {alternativeMessage && (
                  <div className="mt-4 rounded-xl border border-[#9be7c8] bg-[#effcf6] px-4 py-3">
                    <p className="text-xs font-medium text-[#15966a]">
                      {alternativeMessage}
                    </p>
                  </div>
                )}

                {/* Alternative Order */}
                {alternativeOrder && (
                  <div className="mt-4 rounded-xl border border-[#e8dbd0] bg-white p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a17d6c]">
                          Verified Order
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#171717]">
                          {alternativeOrder.customer || "Unknown"}
                        </p>

                        <p className="mt-1 break-all text-xs text-[#8c786d]">
                          {alternativeOrder.customerEmail || "-"}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#effcf6] px-3 py-1 text-xs font-semibold text-[#15966a]">
                        Payment Verified
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] text-[#a17d6c]">Order ID</p>

                        <p className="mt-1 break-all text-xs font-medium text-[#171717]">
                          {alternativeOrder.orderId || alternativeOrder.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-[#a17d6c]">Pickup</p>

                        <p className="mt-1 text-xs font-semibold text-[#d15d2c]">
                          {alternativeOrder.pickupTime ||
                            alternativeOrder.pickupSlot ||
                            "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-[#a17d6c]">Total</p>

                        <p className="mt-1 text-xs font-semibold text-[#171717]">
                          ₹{alternativeOrder.total || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a17d6c]">
                        Items
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {alternativeOrder.items?.map((item, index) => (
                          <span
                            key={`${item.id || item.name}-${index}`}
                            className="rounded-full bg-[#f1e8df] px-3 py-1.5 text-xs text-[#725f53]"
                          >
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAlternativeCollection}
                      disabled={alternativeCollecting}
                      className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${
                        alternativeCollecting
                          ? "cursor-not-allowed bg-[#c8bbb2]"
                          : "bg-[#15966a] hover:bg-[#12845c]"
                      }`}
                    >
                      {alternativeCollecting
                        ? "Updating..."
                        : "Confirm Identity & Collect"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Smart Kitchen Batch Suggestions */}
          {batchSuggestions.length > 0 && (
            <div className="mt-5 rounded-2xl border border-[#e8dbd0] bg-white p-4 sm:p-5">
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-[#171717]">
                      Smart Kitchen Suggestions
                    </h2>

                    <p className="mt-1 text-xs text-[#8c786d]">
                      Common batchable dishes detected across active orders.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#fff3ed] px-3 py-1 text-xs font-semibold text-[#d15d2c]">
                    {batchSuggestions.length} suggestion
                    {batchSuggestions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {batchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="rounded-xl border border-[#eadfd6] bg-[#fffaf6] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#a17d6c]">
                          Possible Batch
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestion.commonItems.map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-[#f1e8df] px-3 py-1.5 text-xs font-medium text-[#725f53]"
                            >
                              {item.name} ×{item.quantity}
                            </span>
                          ))}
                        </div>

                        <p className="mt-3 text-xs text-[#8c786d]">Orders:</p>

                        <div className="mt-1 flex flex-wrap gap-2">
                          {suggestion.orders.map((order) => (
                            <span
                              key={order.id}
                              className="text-xs font-semibold text-[#d15d2c]"
                            >
                              {order.orderId || order.id}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          disabled
                          className="rounded-xl bg-[#d15d2c] px-4 py-2.5 text-xs font-semibold text-white opacity-50"
                        >
                          Create Batch
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleIgnoreBatchSuggestion(suggestion.id)
                          }
                          className="rounded-xl border border-[#dfd2c7] bg-white px-4 py-2.5 text-xs font-semibold text-[#594c45] transition-colors hover:border-[#d15d2c] hover:text-[#d15d2c]"
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
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

                    <p className="mt-2 text-xs text-[#a17d6c]">
                      {order.customer || "Unknown"}
                      {" · "}
                      {order.date || "-"}
                      {" · Placed "}
                      {order.placedTime || "-"}
                      {" · Pickup "}
                      {order.pickupTime || "-"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items?.map((item, index) => (
                        <span
                          key={`${item.id || item.name}-${index}`}
                          className="rounded-full bg-[#f1e8df] px-3 py-1.5 text-xs text-[#725f53]"
                        >
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <p className="text-lg font-semibold text-[#171717]">
                      ₹{order.total || 0}
                    </p>

                    {order.status === "Delivered" ? (
                      <p className="flex items-center gap-1 text-xs font-medium text-[#15966a]">
                        <span>✓</span>
                        Completed
                      </p>
                    ) : order.status === "Waiting for Pickup" ? (
                      <p className="flex items-center gap-1 text-xs font-medium text-[#d15d2c]">
                        <span>🔐</span>
                        Pickup Code Required
                      </p>
                    ) : (
                      <button
                        onClick={() => handleStatusUpdate(order)}
                        disabled={updatingOrderId === order.id}
                        className="flex items-center gap-2 rounded-xl bg-[#d15d2c] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#b94f25] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingOrderId === order.id
                          ? "Updating..."
                          : getActionText(order.status)}

                        {updatingOrderId !== order.id && <span>→</span>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

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
