  import { useNavigate } from "react-router-dom";
  import logo from "../assets/icons/logo.png";

  const RoleSelection = () => {
      const navigate = useNavigate();
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
          <div className="w-full max-w-md px-6 text-center">
            {/* Logo */}
            <div className="mx-auto flex items-center justify-center">
              <img src={logo} alt="logo" className="w-[70px]" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">Smart Canteen</h1>

            <p className="mt-2 text-gray-500">
              Give a Pre-Order and skip the queue, order smarter.
            </p>

            {/* User */}
            <button
              onClick={() => navigate("/user/login")}
              className="mt-12 flex w-full items-center rounded-2xl bg-orange-600 p-5 text-left text-white shadow-md hover:bg-orange-700"
            >
              <span className="mr-5 text-2xl">🎓</span>

              <div className="flex-1">
                <h2 className="text-lg font-semibold">Student / Faculty</h2>
              </div>

              <span className="text-xl">→</span>
            </button>

            {/* Admin */}
            <button
              onClick={() => navigate("/admin/login")}
              className="mt-3 flex w-full items-center rounded-2xl bg-gray-900 p-5 text-left text-white shadow-md hover:bg-gray-800"
            >
              <span className="mr-5 text-2xl">👨‍🍳</span>

              <div className="flex-1">
                <h2 className="text-lg font-semibold">Admin / Owner</h2>
              </div>

              <span className="text-xl">→</span>
            </button>

            {/* Footer */}
            <p className="mt-10 text-xs text-gray-400">
              © 2026 Smart Canteen · All dishes 100% vegetarian
            </p>
          </div>
        </div>
      </>
    );
  };

  export default RoleSelection;
