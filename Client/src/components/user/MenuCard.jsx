import { useState } from "react";

import { useCart } from "../../context/CartContext";

const MenuCard = ({ item }) => {
  const [favorite, setFavorite] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(item);
    } catch (error) {
      console.error("Add To Cart Error:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e4dcd4] bg-white">
      {/* Image */}
      <div className="relative h-[165px] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover ${
            !item.available ? "opacity-40" : ""
          }`}
        />

        {/* Popular */}
        {item.popular && (
          <span className="absolute left-[9px] top-[9px] rounded-full bg-[#cf612e] px-[9px] py-[4px] text-[9px] font-semibold text-white">
            ★ Popular
          </span>
        )}

        {/* Favourite */}
        <button
          onClick={() => setFavorite(!favorite)}
          className="absolute right-[9px] top-[9px] flex h-[31px] w-[31px] items-center justify-center rounded-full bg-white text-[20px] shadow-[0_1px_5px_rgba(0,0,0,0.12)]"
        >
          {favorite ? (
            <span className="text-[#ff3d4f]">♥</span>
          ) : (
            <span className="text-[#9d9189]">♡</span>
          )}
        </button>

        {/* Not Available */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-[#f0b9ad] bg-white px-[12px] py-[6px] text-[10px] font-medium text-[#e56b61]">
              Not Available Today
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="px-[12px] pb-[12px] pt-[10px]">
        {/* Name */}
        <div className="flex items-center gap-[7px]">
          {/* Veg Symbol */}
          <span className="flex h-[15px] w-[15px] items-center justify-center rounded-[3px] border-[1.5px] border-[#00ad4f]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#00ad4f]" />
          </span>

          <h3 className="text-[13px] font-semibold text-[#171717]">
            {item.name}
          </h3>
        </div>

        {/* Description */}
        <p className="mt-[4px] min-h-[31px] text-[10.5px] leading-[1.4] text-[#a07768]">
          {item.description}
        </p>

        {/* Rating */}
        <div className="mt-[7px] flex items-center gap-[4px] text-[10px] text-[#8e8179]">
          <span className="text-[12px] text-[#f2b600]">★</span>

          <span>{item.rating}</span>

          <span>· {item.orders} orders</span>
        </div>

        {/* Price + Add */}
        <div className="mt-[7px] flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#cf5928]">
            ₹{item.price}
          </span>

          {item.available ? (
            <button
              onClick={handleAddToCart}
              className="rounded-[10px] bg-[#ce612e] px-[14px] py-[8px] text-[11px] font-semibold text-white transition hover:bg-[#b95122]"
            >
              + Add
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-[10px] bg-[#ddd7d1] px-[14px] py-[8px] text-[11px] font-semibold text-white"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
