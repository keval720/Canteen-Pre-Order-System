import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems } = useCart();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed left-0 top-0 z-50 h-[63px] w-full border-t-[2px] border-[#292929] border-b border-[#e5dfd8] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-full w-full max-w-[1050px] items-center px-4 sm:px-6 lg:px-0">
        {/* Logo */}
        <button
          onClick={() => navigate("/user/home")}
          className="flex shrink-0 items-center gap-[8px] sm:gap-[9px]"
        >
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-[#cf612e] text-[15px] font-bold text-white">
            S
          </span>

          <span className="font-serif text-[18px] font-semibold tracking-[-0.2px] text-[#282421] sm:text-[21px]">
            Smart Canteen
          </span>
        </button>

        {/* Navigation */}
        <nav className="ml-8 hidden items-center gap-[4px] min-[768px]:flex">
          {/* Home */}
          <button
            onClick={() => navigate("/user/home")}
            className={`rounded-[12px] px-[12px] py-[9px] text-[12px] font-medium transition-all duration-200 lg:px-[15px] ${
              isActive("/user/home")
                ? "bg-[#f2e9df] text-[#ce612e]"
                : "text-[#625a54] hover:bg-[#f5eee8] hover:text-[#ce612e]"
            }`}
          >
            Home
          </button>

          {/* Menu */}
          <button
            onClick={() => navigate("/user/menu")}
            className={`rounded-[12px] px-[12px] py-[9px] text-[12px] font-medium transition-all duration-200 lg:px-[15px] ${
              isActive("/user/menu")
                ? "bg-[#f2e9df] text-[#ce612e]"
                : "text-[#625a54] hover:bg-[#f5eee8] hover:text-[#ce612e]"
            }`}
          >
            Menu
          </button>

          {/* Favourites */}
          <button
            onClick={() => navigate("/user/favourites")}
            className={`rounded-[12px] px-[12px] py-[9px] text-[12px] font-medium transition-all duration-200 lg:px-[15px] ${
              isActive("/user/favourites")
                ? "bg-[#f2e9df] text-[#ce612e]"
                : "text-[#625a54] hover:bg-[#f5eee8] hover:text-[#ce612e]"
            }`}
          >
            Favourites
          </button>

          {/* Order History */}
          <button
            onClick={() => navigate("/user/order-history")}
            className={`rounded-[12px] px-[12px] py-[9px] text-[12px] font-medium transition-all duration-200 lg:px-[15px] ${
              isActive("/user/order-history")
                ? "bg-[#f2e9df] text-[#ce612e]"
                : "text-[#625a54] hover:bg-[#f5eee8] hover:text-[#ce612e]"
            }`}
          >
            My Orders
          </button>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex shrink-0 items-center gap-[6px] sm:gap-[8px]">
          {/* Cart */}
          <button
            onClick={() => navigate("/user/cart")}
            className={`relative flex h-[36px] w-[36px] items-center justify-center rounded-[11px] border text-[17px] transition-all duration-200 sm:h-[39px] sm:w-[39px] sm:text-[19px] ${
              isActive("/user/cart")
                ? "border-[#cf612e] bg-[#f2e9df]"
                : "border-[#ded5cc] bg-white hover:border-[#cf612e] hover:bg-[#faf6f1]"
            }`}
          >
            🛒
            {/* Cart Quantity Badge */}
            {totalItems > 0 && (
              <span className="absolute -right-[5px] -top-[7px] flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#cf612e] px-[4px] text-[10px] font-semibold leading-none text-white shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/user/profile")}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-[11px] text-[11px] font-semibold transition-all duration-200 sm:h-[39px] sm:w-[39px] ${
              isActive("/user/profile")
                ? "bg-[#cf612e] text-white"
                : "bg-[#f1e9df] text-[#c95e2c] hover:bg-[#eaded1]"
            }`}
          >
            PS
          </button>

          {/* Logout */}
          <button
            onClick={() => navigate("/user/login")}
            className="flex h-[36px] w-[25px] items-center justify-center text-[19px] text-[#91857c] transition-all duration-200 hover:text-[#ce612e] sm:h-[38px] sm:w-[27px] sm:text-[20px]"
          >
            ⇥
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
