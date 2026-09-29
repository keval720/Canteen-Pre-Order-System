import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useCart } from "../../context/CartContext";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, itemTotal, gst, convenienceFee, total } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("upi");

  // ==========================================
  // PICKUP SLOT
  // ==========================================

  const pickupSlot = location.state?.pickupSlot || "12:30 PM";

  // ==========================================
  // PAYMENT METHODS
  // ==========================================

  const paymentMethods = [
    {
      id: "upi",
      icon: "📱",
      title: "UPI",
      description: "Google Pay, PhonePe, Paytm & more",
    },
    {
      id: "card",
      icon: "💳",
      title: "Credit / Debit Card",
      description: "Visa, Mastercard & RuPay",
    },
    {
      id: "netbanking",
      icon: "🏦",
      title: "Net Banking",
      description: "Pay using your bank account",
    },
  ];

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = () => {
    // ==========================================
    // PREPARE ORDER ITEMS
    // ==========================================

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),

      // Kitchen preparation information
      preparationTime: Number(item.preparationTime || 0),
      batchable: item.batchable === true,
    }));

    // ==========================================
    // PREPARE ORDER DATA
    // ==========================================

    const orderData = {
      items: orderItems,

      pickupSlot,

      itemTotal,
      gst,
      convenienceFee,
      total,

      paymentMethod,

      // This will later change after successful payment
      paymentStatus: "pending",

      // Initial order status
      status: "Pending",
    };

    // ==========================================
    // TEMPORARY TEST
    // ==========================================

    console.log("Prepared Order Data:", orderData);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f2]">
      <Navbar />

      <main className="mx-auto w-full max-w-[640px] px-4 pb-10 pt-[88px] sm:px-5">
        {/* Header */}
        <div className="mb-[22px]">
          <h1 className="font-serif text-[26px] text-[#1c1917]">Payment</h1>

          <p className="mt-1 text-[12px] text-[#a17d6d]">
            Choose your preferred payment method
          </p>
        </div>

        {/* Payment Methods */}
        <div className="rounded-[14px] border border-[#e4dcd4] bg-white p-[16px]">
          <h2 className="mb-[14px] text-[13px] font-semibold text-[#292421]">
            Select Payment Method
          </h2>

          <div className="space-y-[10px]">
            {paymentMethods.map((method) => {
              const selected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex w-full items-center gap-[12px] rounded-[12px] border p-[12px] text-left transition ${
                    selected
                      ? "border-[#cf632e] bg-[#fff7f1]"
                      : "border-[#e4dcd4] bg-white hover:border-[#cf632e]"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] text-[20px] ${
                      selected ? "bg-[#f2dfd2]" : "bg-[#f5f0eb]"
                    }`}
                  >
                    {method.icon}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#292421]">
                      {method.title}
                    </p>

                    <p className="mt-[2px] text-[10px] text-[#9a7567]">
                      {method.description}
                    </p>
                  </div>

                  {/* Radio */}
                  <div
                    className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-[#cf632e]" : "border-[#cfc5bd]"
                    }`}
                  >
                    {selected && (
                      <span className="h-[9px] w-[9px] rounded-full bg-[#cf632e]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* UPI Information */}
          {paymentMethod === "upi" && (
            <div className="mt-[14px] rounded-[11px] border border-[#e7dfd7] bg-[#faf7f3] px-[12px] py-[11px]">
              <div className="flex items-start gap-[9px]">
                <span className="text-[16px]">🔐</span>

                <div>
                  <p className="text-[11px] font-semibold text-[#5c5049]">
                    Secure UPI Payment
                  </p>

                  <p className="mt-[2px] text-[10px] leading-5 text-[#91837a]">
                    You will be redirected to the secure payment gateway to
                    complete your UPI payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-[16px] rounded-[14px] border border-[#e4dcd4] bg-white p-[16px]">
          <h2 className="mb-[14px] text-[13px] font-semibold text-[#292421]">
            Order Summary
          </h2>

          <div className="space-y-[10px]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-[#eee7e1] pb-[9px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-[#705f56]">
                    {item.name} × {item.quantity}
                  </p>
                </div>

                <span className="shrink-0 text-[11px] font-medium text-[#292421]">
                  ₹
                  {(
                    Number(item.price || 0) * Number(item.quantity || 0)
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-[13px] space-y-[9px] text-[11px]">
            <div className="flex justify-between text-[#8a7b72]">
              <span>Item Total</span>
              <span>₹{itemTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#8a7b72]">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#8a7b72]">
              <span>Convenience Fee</span>
              <span>
                {convenienceFee === 0
                  ? "Free"
                  : `₹${convenienceFee.toFixed(2)}`}
              </span>
            </div>

            <div className="my-[11px] border-t border-dashed border-[#ddd4cc]" />

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#292421]">
                Total to Pay
              </span>

              <span className="text-[17px] font-bold text-[#cf632e]">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="mt-[14px] flex items-start gap-[9px] rounded-[11px] border border-[#dfe8d9] bg-[#f4faf2] px-[12px] py-[11px]">
          <span className="text-[14px]">🔒</span>

          <p className="text-[10px] leading-5 text-[#68715f]">
            Your payment is securely processed through our payment gateway. We
            never store your payment credentials.
          </p>
        </div>

        {/* Pay Button */}
        <button
          type="button"
          onClick={handlePayment}
          className="mt-[18px] flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#cf632e] py-[13px] text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(207,97,46,0.18)] transition hover:bg-[#b95125]"
        >
          🔒 Pay ₹{total.toFixed(2)} & Confirm Order
        </button>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/user/checkout")}
          className="mt-[10px] w-full py-[8px] text-[11px] font-medium text-[#8a7b72] transition hover:text-[#cf632e]"
        >
          ← Back to Checkout
        </button>
      </main>
    </div>
  );
};

export default Payment;
