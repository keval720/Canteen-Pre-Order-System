import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { cartItems, itemTotal, gst, convenienceFee, total, clearCart } =
    useCart();

  const { addOrder } = useOrders();

  const pickupSlot = location.state?.pickupSlot || "12:30 PM";

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePickupCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let index = 0; index < 6; index += 1) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  };

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        )
      ) {
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const createFirebaseOrder = async (razorpayResponse) => {
    if (!user) {
      throw new Error("User session not found. Please login again.");
    }

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      preparationTime: Number(item.preparationTime || 0),
      batchable: item.batchable === true,
    }));

    const pickupCode = generatePickupCode();

    const orderData = {
      userId: user.uid,

      customer: user.displayName || "Customer",

      customerEmail: user.email || "",

      items: orderItems,

      pickupSlot,

      pickupTime: pickupSlot,

      itemTotal: Number(itemTotal || 0),

      gst: Number(gst || 0),

      convenienceFee: Number(convenienceFee || 0),

      total: Number(total || 0),

      paymentMethod,

      paymentStatus: "paid",

      razorpayOrderId: razorpayResponse.razorpay_order_id,

      razorpayPaymentId: razorpayResponse.razorpay_payment_id,

      pickupCode,

      pickupStatus: "pending",

      status: "Pending",

      source: "online",

      batchId: null,

      createdAt: new Date(),
    };

    const createdOrder = await addOrder(orderData);

    return {
      ...createdOrder,
      pickupCode,
    };
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        throw new Error("Please login before making payment.");
      }

      if (!cartItems.length) {
        throw new Error("Your cart is empty.");
      }

      if (!window.Razorpay) {
        throw new Error("Payment gateway is still loading. Please try again.");
      }

      const createOrderResponse = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: total,
          }),
        },
      );

      const createOrderData = await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        throw new Error(
          createOrderData.message || "Failed to create payment order.",
        );
      }

      const razorpayOrder = createOrderData.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Smart Canteen",

        description: "Canteen Food Order",

        order_id: razorpayOrder.id,

        prefill: {
          name: user.displayName || "",

          email: user.email || "",
        },

        notes: {
          pickupSlot,
        },

        theme: {
          color: "#D15D2C",
        },

        handler: async (response) => {
          try {
            setLoading(true);
            setError("");

            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,

                  razorpay_payment_id: response.razorpay_payment_id,

                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed.",
              );
            }

            const createdOrder = await createFirebaseOrder(response);

            await clearCart();

            navigate("/user/order-success", {
              state: {
                orderId: createdOrder.id,

                paymentId: response.razorpay_payment_id,

                pickupCode: createdOrder.pickupCode,

                pickupSlot,

                total,
              },
            });
          } catch (error) {
            console.error("Payment Verification Error:", error);

            setError(
              error.message ||
                "Payment was successful, but order processing failed.",
            );

            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay Payment Failed:", response.error);

        setError(
          response.error?.description || "Payment failed. Please try again.",
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);

      setError(
        error.message || "Something went wrong while processing payment.",
      );

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] px-4 pb-10 pt-[90px]">
      <div className="mx-auto w-full max-w-[900px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[25px] font-bold text-[#171717]">Payment</h1>

          <p className="mt-1 text-[12px] text-[#8e8179]">
            Complete your payment to place the order.
          </p>
        </div>

        {/* Payment Container */}
        <div className="grid gap-5 md:grid-cols-[1fr_330px]">
          {/* Payment Methods */}
          <div className="rounded-[16px] border border-[#e4dcd4] bg-white p-5">
            <h2 className="text-[16px] font-bold text-[#171717]">
              Payment Method
            </h2>

            <p className="mt-1 text-[11px] text-[#9d9189]">
              Select your preferred payment method.
            </p>

            {/* UPI */}
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`mt-5 w-full rounded-[12px] border p-4 text-left transition ${
                paymentMethod === "upi"
                  ? "border-[#D15D2C] bg-[#fff7f3]"
                  : "border-[#e4dcd4] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#171717]">
                    UPI
                  </p>

                  <p className="mt-1 text-[10px] text-[#9d9189]">
                    Google Pay, PhonePe, Paytm and more
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    paymentMethod === "upi"
                      ? "border-[#D15D2C]"
                      : "border-[#bdb4ad]"
                  }`}
                >
                  {paymentMethod === "upi" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#D15D2C]" />
                  )}
                </div>
              </div>
            </button>

            {/* Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`mt-3 w-full rounded-[12px] border p-4 text-left transition ${
                paymentMethod === "card"
                  ? "border-[#D15D2C] bg-[#fff7f3]"
                  : "border-[#e4dcd4] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#171717]">
                    Credit / Debit Card
                  </p>

                  <p className="mt-1 text-[10px] text-[#9d9189]">
                    Visa, Mastercard and more
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    paymentMethod === "card"
                      ? "border-[#D15D2C]"
                      : "border-[#bdb4ad]"
                  }`}
                >
                  {paymentMethod === "card" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#D15D2C]" />
                  )}
                </div>
              </div>
            </button>

            {/* Net Banking */}
            <button
              type="button"
              onClick={() => setPaymentMethod("netbanking")}
              className={`mt-3 w-full rounded-[12px] border p-4 text-left transition ${
                paymentMethod === "netbanking"
                  ? "border-[#D15D2C] bg-[#fff7f3]"
                  : "border-[#e4dcd4] bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#171717]">
                    Net Banking
                  </p>

                  <p className="mt-1 text-[10px] text-[#9d9189]">
                    Pay using your bank account
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    paymentMethod === "netbanking"
                      ? "border-[#D15D2C]"
                      : "border-[#bdb4ad]"
                  }`}
                >
                  {paymentMethod === "netbanking" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#D15D2C]" />
                  )}
                </div>
              </div>
            </button>

            {/* Secure Payment */}
            <div className="mt-5 rounded-[10px] bg-[#f8f5f2] px-4 py-3">
              <p className="text-[10px] leading-[1.5] text-[#8e8179]">
                🔒 Your payment is securely processed by Razorpay. Smart Canteen
                does not store your card or UPI credentials.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-[10px] border border-[#f0b9ad] bg-[#fff3f0] px-4 py-3">
                <p className="text-[11px] leading-[1.5] text-[#d94f3d]">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-[16px] border border-[#e4dcd4] bg-white p-5">
            <h2 className="text-[16px] font-bold text-[#171717]">
              Order Summary
            </h2>

            {/* Items */}
            <div className="mt-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-[#171717]">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#9d9189]">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-semibold text-[#171717]">
                    ₹
                    {(
                      Number(item.price || 0) * Number(item.quantity || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-4 h-px bg-[#eee8e3]" />

            {/* Pickup */}
            <div className="rounded-[10px] bg-[#fff7f3] px-3 py-3">
              <p className="text-[9px] font-medium uppercase tracking-wide text-[#a07768]">
                Pickup Time
              </p>

              <p className="mt-1 text-[13px] font-bold text-[#D15D2C]">
                {pickupSlot}
              </p>
            </div>

            {/* Price Details */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px] text-[#8e8179]">
                <span>Item Total</span>

                <span>₹{Number(itemTotal || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-[#8e8179]">
                <span>GST (5%)</span>

                <span>₹{Number(gst || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-[#8e8179]">
                <span>Convenience Fee</span>

                <span>₹{Number(convenienceFee || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="my-4 h-px bg-[#eee8e3]" />

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#171717]">
                Total
              </span>

              <span className="text-[18px] font-bold text-[#D15D2C]">
                ₹{Number(total || 0).toFixed(2)}
              </span>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading || !cartItems.length}
              className={`mt-5 w-full rounded-[11px] px-4 py-3 text-[12px] font-semibold text-white transition ${
                loading || !cartItems.length
                  ? "cursor-not-allowed bg-[#c9c2bc]"
                  : "bg-[#D15D2C] hover:bg-[#b95122]"
              }`}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${Number(total || 0).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
