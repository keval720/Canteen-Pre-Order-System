import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/common/Navbar";
import { getMenu } from "../../services/menuService";

const categories = ["All", "Breakfast", "Snacks", "Main Course", "Beverages"];

const Menu = () => {
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);

        const firebaseMenu = await getMenu();

        setMenu(firebaseMenu);
      } catch (error) {
        console.error("Load Menu Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const menuItems = useMemo(() => {
    return menu.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price || 0),
      description: item.description || "",
      image: item.imageUrl || "",
      available: item.status === true,

      preparationTime: Number(item.preparationTime || 0),
      batchable: item.batchable === true,
    }));
  }, [menu]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;

      const searchValue = search.toLowerCase().trim();

      const searchMatch =
        item.name.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue);

      const availabilityMatch = !availableOnly || item.available;

      return categoryMatch && searchMatch && availabilityMatch;
    });
  }, [menuItems, activeCategory, search, availableOnly]);

  const toggleFavorite = (id) => {
    setFavorites((previousFavorites) =>
      previousFavorites.includes(id)
        ? previousFavorites.filter((itemId) => itemId !== id)
        : [...previousFavorites, id],
    );
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);
    } catch (error) {
      console.error("Add To Cart Error:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-7 sm:px-5">
        {/* Header */}
        <h1 className="font-serif text-[23px] text-[#1c1917]">Our Menu</h1>

        <p className="mt-1 text-[13px] text-[#a17d6d]">
          All dishes are 100% vegetarian · Freshly prepared daily
        </p>

        {/* Search + Availability */}
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-[#ded2c7] bg-white px-4">
            <span className="mr-3 shrink-0 text-xl text-[#9d8d81]">⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for dishes..."
              className="min-w-0 w-full bg-transparent text-xs outline-none"
            />
          </div>

          {/* Available Only */}
          <label className="flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ded2c7] bg-white px-4 text-xs sm:w-auto">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="accent-[#cf632e]"
            />
            Available only
          </label>
        </div>

        {/* Categories */}
        <div className="mt-4 w-full overflow-x-auto pb-1">
          <div className="flex w-max gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-all duration-200 ${
                  activeCategory === category
                    ? "border-[#cf632e] bg-[#cf632e] text-white"
                    : "border-[#ded2c7] bg-white text-[#5e554f] hover:border-[#cf632e] hover:text-[#cf632e]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Item Count */}
        <p className="mb-4 mt-7 text-[11px] text-[#bd8065]">
          {loading ? "LOADING..." : `${filteredItems.length} ITEMS`}
        </p>

        {/* Food Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#8c8179]">Loading menu...</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => {
              const favorite = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="min-w-0 overflow-hidden rounded-[15px] border border-[#e4dcd4] bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-[165px]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`h-full w-full object-cover ${
                          !item.available ? "opacity-25" : ""
                        }`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#eee8e1] text-3xl">
                        🍽️
                      </div>
                    )}

                    {/* Favourite */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl shadow transition-all duration-200 ${
                        favorite
                          ? "text-red-500"
                          : "text-[#a4968b] hover:text-red-400"
                      }`}
                    >
                      {favorite ? "♥" : "♡"}
                    </button>

                    {/* Not Available */}
                    {!item.available && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-white px-3 py-1.5 text-[11px] text-red-400 shadow">
                          Not Available Today
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                    {/* Name */}
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border-2 ${
                          item.available
                            ? "border-green-500"
                            : "border-gray-400"
                        }`}
                      >
                        <span
                          className={`h-[5px] w-[5px] rounded-full ${
                            item.available ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </span>

                      <h3 className="truncate text-[13px] font-semibold text-[#171717]">
                        {item.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="mt-1 min-h-[32px] text-[11px] leading-[1.45] text-[#9a7567]">
                      {item.description}
                    </p>

                    {/* Price + Add */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[15px] font-bold text-[#cf5927]">
                        ₹{item.price}
                      </span>

                      <button
                        disabled={!item.available}
                        onClick={() => handleAddToCart(item)}
                        className="shrink-0 rounded-[10px] bg-[#cf632e] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#b95222] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-4xl">🍽️</div>

            <h2 className="mt-3 font-serif text-xl text-[#1c1917]">
              No dishes found
            </h2>

            <p className="mt-2 text-xs text-[#8c8179]">
              Try another search or category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
