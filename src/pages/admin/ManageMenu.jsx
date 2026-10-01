import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  subscribeToMenu,
  updateMenuItem,
  deleteMenuItem,
} from "../../services/menuService";
import { Pencil, Trash2 } from "lucide-react";

const ManageMenu = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const categories = ["All", "Breakfast", "Snacks", "Main Course", "Beverages"];

  // ==========================================
  // REAL-TIME MENU LISTENER
  // ==========================================

  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubscribe = subscribeToMenu(
      (menu) => {
        setDishes(menu);
        setLoading(false);
      },
      (error) => {
        console.error("Menu Listener Error:", error);
        setError("Failed to load menu.");
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // ==========================================
  // ENABLE / DISABLE DISH
  // ==========================================

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await updateMenuItem(id, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Failed to update dish status.");
    }
  };

  // ==========================================
  // DELETE DISH
  // ==========================================

  const deleteDish = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this dish?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteMenuItem(id);
    } catch (error) {
      console.error("Delete Dish Error:", error);
      alert("Failed to delete dish.");
    }
  };

  // ==========================================
  // FILTER DISHES
  // ==========================================

  const filteredDishes = dishes.filter((dish) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      dish.name?.toLowerCase().includes(searchValue) ||
      dish.category?.toLowerCase().includes(searchValue);

    const matchesCategory =
      activeCategory === "All" || dish.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const availableCount = dishes.filter((dish) => dish.status === true).length;

  return (
    <AdminLayout>
      <>
        <div className="min-h-screen bg-[#f9f6f1] px-3 py-4 sm:px-5 sm:py-5 lg:px-8">
          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#171717] sm:text-2xl">
                Menu Management
              </h1>

              <p className="mt-1 text-xs text-[#9a7664] sm:text-sm">
                {dishes.length} dishes · {availableCount} available
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/managemenu/add-dish")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d15d2c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b94f25] sm:w-fit sm:px-5 sm:py-3"
            >
              <span className="text-lg">+</span>
              Add New Dish
            </button>
          </div>

          {/* ==========================================
              SEARCH + CATEGORIES
          ========================================== */}

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f8178]">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search menu..."
                className="h-11 w-full rounded-xl border border-[#e5d8cd] bg-white px-11 text-sm text-[#333] outline-none placeholder:text-[#9c8f87] focus:border-[#d15d2c] sm:h-12"
              />
            </div>

            {/* Categories */}
            <div className="w-full overflow-x-auto pb-1 xl:w-auto xl:max-w-[55%] xl:pb-0">
              <div className="flex w-max gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-xs transition-colors sm:px-5 sm:py-3 sm:text-sm ${
                      activeCategory === category
                        ? "border-[#d15d2c] bg-[#d15d2c] text-white shadow-sm"
                        : "border-[#e5d8cd] bg-white text-[#594c45] hover:border-[#d15d2c]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <div className="mt-5 rounded-2xl border border-[#eadfd6] bg-white py-12 text-center text-sm text-[#8c786d]">
              Loading menu...
            </div>
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* ==========================================
                  TABLE
                  Shows only at 1024px+
              ========================================== */}

              <div className="mt-5 hidden overflow-hidden rounded-2xl border border-[#eadfd6] bg-white lg:block">
                {/* Table Header */}
                <div className="grid grid-cols-[minmax(220px,3fr)_1.3fr_.7fr_1fr_1.8fr] items-center bg-[#faf7f3] px-4 py-3 text-xs font-medium text-[#8c786d] xl:px-5">
                  <div>Dish</div>
                  <div>Category</div>
                  <div>Price</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {/* Table Rows */}
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="grid min-h-[64px] grid-cols-[minmax(220px,3fr)_1.3fr_.7fr_1fr_1.8fr] items-center border-t border-[#eee4dc] px-4 xl:px-5"
                  >
                    {/* Dish */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#eee8e1]">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg">
                            🍽️
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#171717]">
                          {dish.name}
                        </p>

                        <p className="truncate text-xs text-[#a17d6c]">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="truncate pr-2 text-sm text-[#594c45]">
                      {dish.category}
                    </div>

                    {/* Price */}
                    <div className="text-sm font-semibold text-[#d15d2c]">
                      ₹{dish.price}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                          dish.status
                            ? "border-[#9be7c8] bg-[#effcf6] text-[#15966a]"
                            : "border-[#ffd6d6] bg-[#fff3f3] text-[#ef6262]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            dish.status ? "bg-[#25b982]" : "bg-[#ff6b6b]"
                          }`}
                        />

                        {dish.status ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/managemenu/edit-dish/${dish.id}`)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4d8ce] text-[#695950] transition-colors hover:bg-[#f7f1eb]"
                      >
                        <Pencil size={15} strokeWidth={1.8} />
                      </button>

                      <button
                        onClick={() => toggleStatus(dish.id, dish.status)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          dish.status
                            ? "border-[#ffd1d1] text-[#ef5350] hover:bg-[#fff4f4]"
                            : "border-[#bcebd5] text-[#15966a] hover:bg-[#effcf6]"
                        }`}
                      >
                        {dish.status ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="px-1 text-sm text-[#ff5d5d] transition-colors hover:text-[#d93636]"
                      >
                        <Trash2 size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredDishes.length === 0 && (
                  <div className="py-10 text-center text-sm text-[#8c786d]">
                    No dishes found.
                  </div>
                )}
              </div>

              {/* ==========================================
                  RESPONSIVE CARDS
                  Shows below 1024px
              ========================================== */}

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="rounded-2xl border border-[#eadfd6] bg-white p-4"
                  >
                    {/* Dish Information */}
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eee8e1]">
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-[#171717]">
                              {dish.name}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-xs text-[#a17d6c]">
                              {dish.description}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/admin/managemenu/edit-dish/${dish.id}`)
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e4d8ce] text-[#695950] hover:bg-[#f7f1eb]"
                          >
                            <Pencil size={15} strokeWidth={1.8} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-[#9a8578]">Category</p>

                        <p className="mt-1 truncate text-[#594c45]">
                          {dish.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#9a8578]">Price</p>

                        <p className="mt-1 font-semibold text-[#d15d2c]">
                          ₹{dish.price}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#9a8578]">Status</p>

                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                              dish.status
                                ? "border-[#9be7c8] bg-[#effcf6] text-[#15966a]"
                                : "border-[#ffd6d6] bg-[#fff3f3] text-[#ef6262]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                dish.status ? "bg-[#25b982]" : "bg-[#ff6b6b]"
                              }`}
                            />

                            {dish.status ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="mt-4 flex items-center gap-2 border-t border-[#eee4dc] pt-3">
                      <button
                        onClick={() => toggleStatus(dish.id, dish.status)}
                        className={`flex-1 rounded-lg border py-2 text-xs font-medium ${
                          dish.status
                            ? "border-[#ffd1d1] text-[#ef5350]"
                            : "border-[#bcebd5] text-[#15966a]"
                        }`}
                      >
                        {dish.status ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="rounded-lg border border-[#ffd1d1] px-4 py-2 text-xs text-[#ff5d5d]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {filteredDishes.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-[#eadfd6] bg-white py-10 text-center text-sm text-[#8c786d]">
                    No dishes found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </>
    </AdminLayout>
  );
};

export default ManageMenu;
