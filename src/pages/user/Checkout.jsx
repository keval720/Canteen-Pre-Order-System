import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, loading, itemTotal, gst, convenienceFee, total } =
    useCart();

  const [selectedSlot, setSelectedSlot] = useState("12:30 PM");

  const pickupSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] pt-[63px]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd6] border-t-[#d15d2c]" />
        </main>
      </>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 pt-[63px]">
          <div className="w-full max-w-[420px] text-center">
            <div className="mb-5 text-[55px]">🛒</div>

            <h1 className="font-serif text-[26px] text-[#1c1917]">
              Your Cart is Empty
            </h1>

            <p className="mt-2 text-[13px] leading-6 text-[#81756e]">
              Add some dishes before proceeding to checkout.
            </p>

            <button
              onClick={() => navigate("/user/menu")}
              className="mt-6 rounded-[11px] bg-[#cf612e] px-6 py-3 text-[12px] font-semibold text-white transition hover:bg-[#b95125]"
            >
              Explore Menu
            </button>
          </div>
        </main>
      </>
    );
  }

  // ==========================================
  // CONTINUE TO PAYMENT
  // ==========================================

  const handleContinueToPayment = () => {
    navigate("/user/payment", {
      state: {
        pickupSlot: selectedSlot,
      },
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f2]">
      <Navbar />

      <main className="mx-auto w-full max-w-[640px] px-4 pb-10 pt-[88px] sm:px-5">
        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-[22px]">
          <h1 className="font-serif text-[26px] text-[#1c1917]">Checkout</h1>
        </div>

        {/* ========================================== */}
        {/* PICKUP SLOT */}
        {/* ========================================== */}

        <div className="rounded-[14px] border border-[#e4dcd4] bg-white p-[16px]">
          {/* Header */}
          <div className="flex items-start gap-[9px]">
            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#f5e9df] text-[14px] text-[#cf632e]">
              ◷
            </div>

            <div>
              <h2 className="text-[12px] font-semibold text-[#292421]">
                Choose Pickup Slot
              </h2>

              <p className="mt-[2px] text-[9px] text-[#9a7567]">
                Select a future time to collect your order
              </p>
            </div>
          </div>

          {/* Pickup Slots */}
          <div className="mt-[13px] flex flex-wrap gap-[7px]">
            {pickupSlots.map((slot) => {
              const isSelected = selectedSlot === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-[10px] border px-[13px] py-[7px] text-[10px] font-medium transition ${
                    isSelected
                      ? "border-[#cf632e] bg-[#cf632e] text-white"
                      : "border-[#ded3ca] bg-white text-[#625850] hover:border-[#cf632e] hover:text-[#cf632e]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Pickup Location */}
          <div className="mt-[12px] flex items-center gap-[7px] rounded-[10px] bg-[#f8f5f1] px-[10px] py-[9px]">
            <span className="text-[12px] text-[#9a7567]">♧</span>

            <p className="text-[9px] text-[#9a7567]">
              Pickup at{" "}
              <span className="font-semibold text-[#292421]">
                Main Canteen Counter
              </span>
              , Ground Floor, Block A
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* ORDER SUMMARY */}
        {/* ========================================== */}

        <div className="mt-[16px] rounded-[14px] border border-[#e4dcd4] bg-white p-[16px]">
          <h2 className="mb-[13px] text-[12px] font-semibold text-[#292421]">
            Order Summary
          </h2>

          {/* Items */}
          <div className="space-y-0">
            {cartItems.map((item) => {
              const itemPrice =
                Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-[#eee5de] py-[8px] first:pt-0"
                >
                  <p className="text-[10px] text-[#896f63]">
                    {item.name} × {item.quantity}
                  </p>

                  <p className="text-[10px] text-[#292421]">
                    ₹{itemPrice.toFixed(0)}
                  </p>
                </div>
              );
            })}

            {/* GST */}
            <div className="flex items-center justify-between border-b border-[#eee5de] py-[8px]">
              <p className="text-[10px] text-[#896f63]">GST (5%)</p>

              <p className="text-[10px] text-[#9a7567]">₹{gst.toFixed(0)}</p>
            </div>

            {/* Convenience Fee */}
            {convenienceFee > 0 && (
              <div className="flex items-center justify-between border-b border-[#eee5de] py-[8px]">
                <p className="text-[10px] text-[#896f63]">Convenience Fee</p>

                <p className="text-[10px] text-[#9a7567]">
                  ₹{convenienceFee.toFixed(0)}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-[10px]">
              <p className="text-[12px] font-bold text-[#292421]">Total</p>

              <p className="text-[14px] font-bold text-[#cf632e]">
                ₹{total.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PAY BUTTON */}
        {/* ========================================== */}

        <button
          type="button"
          onClick={handleContinueToPayment}
          className="mt-[16px] w-full rounded-[12px] bg-[#cf632e] py-[13px] text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(207,97,46,0.18)] transition hover:bg-[#b95125]"
        >
          🔒 Pay ₹{total.toFixed(0)} & Confirm Order
        </button>
      </main>
    </div>
  );
};

export default Checkout;
