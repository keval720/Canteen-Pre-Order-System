import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import MenuCard from "../../components/user/MenuCard";
import { getMenu } from "../../services/menuService";

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);

        const firebaseMenu = await getMenu();

        setMenu(firebaseMenu);
      } catch (error) {
        console.error("Home Menu Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  /*
   * --------------------------------
   * MENU DATA
   * --------------------------------
   */

  const availableItems = menu.filter((item) => item.status === true);

  const popularItems = availableItems.slice(0, 4);

  const formatMenuItem = (item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    price: Number(item.price || 0),
    available: item.status === true,
    image: item.imageUrl || "",
  });

  const popularMenuItems = popularItems.map(formatMenuItem);
  const availableMenuItems = availableItems.map(formatMenuItem);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-[1050px] px-4 pb-[60px] pt-[63px] lg:px-0">
        {/* Hero */}
        <section className="relative mt-[25px] h-[245px] overflow-hidden rounded-[21px]">
          <img
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1500&q=90"
            alt="Indian food"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 flex h-full flex-col justify-center px-[25px] sm:px-[38px]">
            {/* Open Status */}
            <div className="mb-[10px] flex w-fit items-center gap-[6px] rounded-full bg-[#5e574f]/80 px-[11px] py-[6px] backdrop-blur-sm">
              <span className="h-[8px] w-[8px] rounded-full bg-[#32b86d]" />

              <span className="text-[10px] font-semibold text-white">
                Canteen Open · Closes at 4 PM
              </span>
            </div>

            {/* Greeting */}
            <h1 className="font-serif text-[30px] leading-[1.1] text-white sm:text-[36px]">
              Good afternoon, <span className="italic">Priya</span> 👋
            </h1>

            <p className="mt-[8px] text-[12px] text-white">
              What are you craving today?
            </p>

            <button
              onClick={() => navigate("/user/menu")}
              className="mt-[20px] w-fit rounded-[10px] bg-white px-[25px] py-[10px] text-[11px] font-semibold text-[#c95e2c] shadow-sm transition hover:bg-[#fff8f2]"
            >
              Explore Menu
            </button>
          </div>
        </section>


        {/* Popular Today */}
        <section className="mt-[38px]">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-[20px] text-[#1c1917]">
                Popular Today
              </h2>

              <p className="mt-[3px] text-[10px] text-[#a17d6e]">
                Available dishes from today's menu
              </p>
            </div>

            <button
              onClick={() => navigate("/user/menu")}
              className="mb-[2px] text-[11px] font-medium text-[#ce612e] hover:underline"
            >
              See all →
            </button>
          </div>

          <div className="mt-[14px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <p className="col-span-full py-8 text-center text-sm text-[#a17d6e]">
                Loading menu...
              </p>
            ) : popularMenuItems.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-[#a17d6e]">
                No dishes available.
              </p>
            ) : (
              popularMenuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))
            )}
          </div>
        </section>

        {/* Available Now */}
        <section className="mt-[38px]">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-[20px] text-[#1c1917]">
                Available Now
              </h2>

              <p className="mt-[3px] text-[10px] text-[#a17d6e]">
                {loading
                  ? "Loading menu..."
                  : `${availableItems.length} items ready to order`}
              </p>
            </div>

            <button
              onClick={() => navigate("/user/menu")}
              className="mb-[2px] text-[11px] font-medium text-[#ce612e] hover:underline"
            >
              See all →
            </button>
          </div>

          <div className="mt-[14px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <p className="col-span-full py-8 text-center text-sm text-[#a17d6e]">
                Loading menu...
              </p>
            ) : availableMenuItems.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-[#a17d6e]">
                No dishes available right now.
              </p>
            ) : (
              availableMenuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
