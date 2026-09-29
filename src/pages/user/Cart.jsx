import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    loading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItems,
    itemTotal,
    gst,
    convenienceFee,
    total,
  } = useCart();

  // ==========================================
  // LOADING CART
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-4 pb-[60px] pt-[32px] lg:px-0">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#eadfd6] border-t-[#d15d2c]" />
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-4 pb-[60px] pt-[32px] lg:px-0">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-[80px] w-[80px] items-center justify-center rounded-[22px] bg-[#f2e9df] text-[36px]">
              🛒
            </div>

            <h1 className="font-serif text-[28px] text-[#1c1917]">
              Your Cart is Empty
            </h1>

            <p className="mt-2 text-[12px] text-[#a17d6e]">
              Add some delicious dishes to your cart.
            </p>

            <button
              onClick={() => navigate("/user/menu")}
              className="mt-6 rounded-[11px] bg-[#cf612e] px-[28px] py-[12px] text-[12px] font-semibold text-white transition hover:bg-[#bd5125]"
            >
              Explore Menu
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-[640px] px-4 pb-[60px] pt-[30px] sm:px-0">
        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="mb-[25px]">
          <h1 className="font-serif text-[26px] text-[#1c1917]">
            Your Cart{" "}
            <span className="text-[16px] text-[#a17d6e]">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        {/* ==========================================
            CART ITEMS
        ========================================== */}

        <div className="space-y-[14px]">
          {cartItems.map((item) => {
            const itemTotalPrice = item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="relative rounded-[17px] border border-[#e8dfd7] bg-white p-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute right-[13px] top-[10px] text-[16px] font-light text-[#b5aaa2] transition hover:text-[#cf612e]"
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>

                <div className="flex items-center">
                  {/* Image */}
                  <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[13px] bg-[#f1e9df]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[25px]">
                        🍱
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="ml-[12px] min-w-0 flex-1 self-start pt-[3px]">
                    <div className="flex items-center gap-[6px]">
                      <span className="flex h-[15px] w-[15px] items-center justify-center rounded-[3px] border-2 border-[#00a63c]">
                        <span className="h-[5px] w-[5px] rounded-full bg-[#00a63c]" />
                      </span>

                      <h2 className="truncate pr-[20px] text-[14px] font-semibold text-[#171717]">
                        {item.name}
                      </h2>
                    </div>

                    <p className="mt-[3px] text-[11px] text-[#a17d6e]">
                      {item.category || "Food"}
                    </p>

                    <p className="mt-[5px] text-[12px] font-semibold text-[#d15d2c]">
                      ₹{item.price}{" "}
                      <span className="font-normal text-[#a17d6e]">each</span>
                    </p>
                  </div>

                  {/* Quantity + Total */}
                  <div className="ml-[8px] flex shrink-0 flex-col items-end justify-between self-stretch pt-[21px]">
                    {/* Quantity */}
                    <div className="flex h-[32px] items-center rounded-[12px] bg-[#f1e9df]">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-[32px] w-[32px] items-center justify-center text-[17px] text-[#d15d2c] transition hover:text-[#b94f24]"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>

                      <span className="w-[20px] text-center text-[12px] font-semibold text-[#171717]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-[32px] w-[32px] items-center justify-center text-[17px] text-[#d15d2c] transition hover:text-[#b94f24]"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <p className="mt-[7px] text-[13px] font-bold text-[#171717]">
                      ₹{itemTotalPrice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Continue Shopping */}
        <div className="mb-[18px] min-[768px]:hidden mt-3">
          <button
            onClick={() => navigate("/user/menu")}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#ded5cc] bg-white py-[11px] text-[12px] font-semibold text-[#625a54] transition hover:border-[#cf612e] hover:text-[#cf612e]"
          >
            <span className="text-[17px] leading-none">←</span>
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* ==========================================
            BILL SUMMARY
        ========================================== */}

        <section className="mt-[24px] rounded-[17px] border border-[#e8dfd7] bg-white p-[20px]">
          <h2 className="text-[14px] font-semibold text-[#171717]">
            Bill Summary
          </h2>

          <div className="mt-[18px] space-y-[12px]">
            {/* Item Total */}
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#625a54]">Item Total</span>

              <span className="text-[#625a54]">₹{itemTotal}</span>
            </div>

            {/* GST */}
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#625a54]">GST (5%)</span>

              <span className="text-[#625a54]">₹{gst}</span>
            </div>

            {/* Convenience Fee */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#a17d6e]">Convenience Fee</span>

              <span className="font-medium text-[#00a63c]">
                {convenienceFee === 0 ? "FREE" : `₹${convenienceFee}`}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-[#e1d8d0]" />

            {/* Total */}
            <div className="flex items-center justify-between pt-[1px]">
              <span className="text-[15px] font-bold text-[#171717]">
                To Pay
              </span>

              <span className="text-[15px] font-bold text-[#d15d2c]">
                ₹{total}
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================
            VEGETARIAN MESSAGE
        ========================================== */}

        <div className="mt-[20px] flex items-center gap-[9px] rounded-[12px] border border-[#ccefd9] bg-[#effcf4] px-[16px] py-[11px]">
          <span className="text-[15px] text-[#00a63c]">✓</span>

          <p className="text-[11px] font-medium text-[#008c36]">
            All items are 100% vegetarian and freshly prepared.
          </p>
        </div>

        {/* ==========================================
            CHECKOUT BUTTON
        ========================================== */}

        <button
          onClick={() => navigate("/user/checkout")}
          className="mt-[20px] w-full rounded-[12px] bg-[#d15d2c] py-[15px] text-[13px] font-semibold text-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition hover:bg-[#bd5125] active:scale-[0.99]"
        >
          Proceed to Checkout · ₹{total}
        </button>
      </main>
    </div>
  );
};

export default Cart;
