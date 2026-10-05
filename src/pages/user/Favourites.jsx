import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import { subscribeToMenu } from "../../services/menuService";

import {
  subscribeToUserFavourites,
  updateUserFavourites,
} from "../../services/userService";

const Favourites = () => {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [menu, setMenu] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LISTEN TO MENU + FAVOURITES IN REAL TIME
  // ==========================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setMenu([]);
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let menuLoaded = false;
    let favouritesLoaded = false;

    const checkLoading = () => {
      if (menuLoaded && favouritesLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeMenu = subscribeToMenu(
      (firebaseMenu) => {
        const availableMenu = firebaseMenu.filter(
          (item) => item.status === true,
        );

        setMenu(availableMenu);

        menuLoaded = true;
        checkLoading();
      },
      (error) => {
        console.error("Favourite Menu Listener Error:", error);

        setMenu([]);

        menuLoaded = true;
        checkLoading();
      },
    );

    const unsubscribeFavourites = subscribeToUserFavourites(
      user.uid,
      (firebaseFavourites) => {
        setFavorites(firebaseFavourites);

        favouritesLoaded = true;
        checkLoading();
      },
      (error) => {
        console.error("Favourites Listener Error:", error);

        setFavorites([]);

        favouritesLoaded = true;
        checkLoading();
      },
    );

    return () => {
      unsubscribeMenu();
      unsubscribeFavourites();
    };
  }, [user, authLoading]);

  // ==========================================
  // REMOVE FAVOURITE
  // ==========================================

  const removeFavorite = async (id) => {
    if (!user) {
      return;
    }

    try {
      const updatedFavorites = favorites.filter((itemId) => itemId !== id);

      await updateUserFavourites(user.uid, updatedFavorites);
    } catch (error) {
      console.error("Remove Favourite Error:", error);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (item) => {
    try {
      await addToCart({
        id: item.id,
        name: item.name,
        description: item.description || "",
        category: item.category || "",
        price: Number(item.price || 0),
        image: item.imageUrl || "",
        preparationTime: Number(item.preparationTime || 0),
        batchable: item.batchable === true,
      });
    } catch (error) {
      console.error("Add To Cart Error:", error);
    }
  };

  // ==========================================
  // VISIBLE FAVOURITES
  // ==========================================

  const visibleFavorites = menu.filter((item) => favorites.includes(item.id));

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto w-full max-w-[1100px] px-4 py-7 pt-[88px] sm:px-5">
        {/* Header */}
        <div>
          <h1 className="font-serif text-[23px] text-[#1c1917]">Favourites</h1>

          <p className="mb-6 mt-1 text-[13px] text-[#a17d6d]">
            {favorites.length} saved dishes
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eadfd6] border-t-[#d15d2c]" />
          </div>
        ) : favorites.length > 0 && visibleFavorites.length > 0 ? (
          /* Favourite Items */
          <div className="grid w-full max-w-[790px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFavorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                className="min-w-0 overflow-hidden rounded-[15px] border border-[#e4dcd4] bg-white shadow-sm"
              >
                {/* Image */}
                <div className="relative h-[165px]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f3eee8] text-xs text-[#9a7567]">
                      No Image
                    </div>
                  )}

                  {/* Remove Favourite */}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl text-red-500 shadow transition hover:bg-red-50"
                  >
                    ♥
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3">
                  {/* Name */}
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border-2 border-green-500">
                      <span className="h-[5px] w-[5px] rounded-full bg-green-500" />
                    </span>

                    <h3 className="truncate text-[13px] font-semibold text-[#171717]">
                      {item.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-1 min-h-[32px] text-[11px] leading-[1.45] text-[#9a7567]">
                    {item.description || "No description available."}
                  </p>

                  {/* Price + Add */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[15px] font-bold text-[#cf5927]">
                      ₹{Number(item.price || 0)}
                    </span>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="shrink-0 rounded-[10px] bg-[#cf632e] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#b95222]"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-24 text-center">
            <div className="text-5xl text-[#cf632e]">♡</div>

            <h2 className="mt-3 font-serif text-xl text-[#1c1917]">
              No favourites yet
            </h2>

            <p className="mt-2 text-xs text-[#8c8179]">
              Add dishes to your favourites from the menu.
            </p>

            <button
              onClick={() => navigate("/user/menu")}
              className="mt-5 rounded-xl bg-[#cf632e] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#b95222]"
            >
              Explore Menu
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
