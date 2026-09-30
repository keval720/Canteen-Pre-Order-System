import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, paymentId, pickupCode, pickupSlot, total } =
    location.state || {};

  return (
    <div className="min-h-screen bg-[#f8f5f2] px-4 pt-[20px] md:pt-[50px]">
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center">
        {/* Success Icon */}
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#e8f7ee]">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#27ae60]">
            <span className="text-[24px] font-bold text-white">✓</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-center text-[25px] font-bold text-[#171717]">
          Order Confirmed!
        </h1>

        <p className="mt-2 text-center text-[12px] text-[#8e8179]">
          Your payment was successful and your order has been placed.
        </p>

        {/* Pickup Code Card */}
        <div className="mt-7 w-full rounded-[18px] border border-[#f0cfc2] bg-white p-6 text-center shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#a07768]">
            Your Pickup Code
          </p>

          <div className="mt-4 rounded-[14px] border-2 border-dashed border-[#D15D2C] bg-[#fff7f3] px-4 py-5">
            <p className="text-[32px] font-extrabold tracking-[7px] text-[#D15D2C]">
              {pickupCode || "------"}
            </p>
          </div>

          <p className="mt-4 text-[11px] leading-[1.5] text-[#8e8179]">
            Show this code at the canteen counter to collect your food.
          </p>

          <div className="mt-3 rounded-[9px] bg-[#fff3ed] px-3 py-2">
            <p className="text-[10px] font-medium text-[#D15D2C]">
              Keep this code safe until your order is collected.
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-4 w-full rounded-[16px] border border-[#e4dcd4] bg-white p-5">
          <h2 className="text-[15px] font-bold text-[#171717]">
            Order Details
          </h2>

          <div className="mt-4 space-y-3">
            {/* Order ID */}
            <div className="flex items-start justify-between gap-4">
              <span className="text-[11px] text-[#8e8179]">Order ID</span>

              <span className="max-w-[65%] break-all text-right text-[11px] font-medium text-[#171717]">
                {orderId || "N/A"}
              </span>
            </div>

            {/* Payment ID */}
            <div className="flex items-start justify-between gap-4">
              <span className="text-[11px] text-[#8e8179]">Payment ID</span>

              <span className="max-w-[65%] break-all text-right text-[11px] font-medium text-[#171717]">
                {paymentId || "N/A"}
              </span>
            </div>

            {/* Pickup */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8e8179]">Pickup Time</span>

              <span className="text-[11px] font-semibold text-[#D15D2C]">
                {pickupSlot || "N/A"}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8e8179]">Payment Status</span>

              <span className="rounded-full bg-[#e8f7ee] px-2.5 py-1 text-[9px] font-semibold text-[#249653]">
                Paid
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-[#eee8e3] pt-3">
              <span className="text-[12px] font-semibold text-[#171717]">
                Total Paid
              </span>

              <span className="text-[17px] font-bold text-[#D15D2C]">
                ₹{Number(total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-4 w-full rounded-[12px] border border-[#e4dcd4] bg-white px-4 py-3">
          <p className="text-[10px] leading-[1.6] text-[#8e8179]">
            <span className="font-semibold text-[#171717]">Pickup:</span> Please
            show your pickup code at the canteen counter when collecting your
            order.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/user/order-history")}
            className="w-full rounded-[11px] border border-[#D15D2C] bg-white px-4 py-3 text-[11px] font-semibold text-[#D15D2C] transition hover:bg-[#fff7f3]"
          >
            View Order History
          </button>

          <button
            type="button"
            onClick={() => navigate("/user/home")}
            className="w-full rounded-[11px] bg-[#D15D2C] px-4 py-3 text-[11px] font-semibold text-white transition hover:bg-[#b95122]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
