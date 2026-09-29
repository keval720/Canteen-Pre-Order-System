import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import { useOrders } from "../../context/OrderContext";
import { getMenu } from "../../services/menuService";

const Report = () => {
  const navigate = useNavigate();

  const { orders } = useOrders();

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const firebaseMenu = await getMenu();
        setMenu(firebaseMenu);
      } catch (error) {
        console.error("Report Menu Error:", error);
      }
    };

    loadMenu();
  }, []);

  /*
   * --------------------------------
   * MENU LOOKUP
   * --------------------------------
   */

  const menuPrices = {};

  const menuCategories = {};

  menu.forEach((item) => {
    menuPrices[item.name] = Number(item.price || 0);
    menuCategories[item.name] = item.category;
  });

  /*
   * --------------------------------
   * SUMMARY CARDS
   * --------------------------------
   */

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  );

  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  const totalItemsSold = orders.reduce((total, order) => {
    const orderItems = (order.items || []).reduce(
      (itemTotal, item) => itemTotal + Number(item.quantity || 0),
      0,
    );

    return total + orderItems;
  }, 0);

  /*
   * --------------------------------
   * ORDERS BY CATEGORY
   * --------------------------------
   */

  const categoryTotals = {
    Snacks: 0,
    Breakfast: 0,
    "Main Course": 0,
    Beverages: 0,
  };

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const category = menuCategories[item.name];

      if (category && categoryTotals[category] !== undefined) {
        categoryTotals[category] += Number(item.quantity || 0);
      }
    });
  });

  const totalCategoryItems = Object.values(categoryTotals).reduce(
    (total, value) => total + value,
    0,
  );

  const categoryData = [
    {
      name: "Snacks",
      value: categoryTotals.Snacks,
      percentage:
        totalCategoryItems > 0
          ? Math.round((categoryTotals.Snacks / totalCategoryItems) * 100)
          : 0,
      barClass: "bg-[#f5b000]",
    },
    {
      name: "Breakfast",
      value: categoryTotals.Breakfast,
      percentage:
        totalCategoryItems > 0
          ? Math.round((categoryTotals.Breakfast / totalCategoryItems) * 100)
          : 0,
      barClass: "bg-[#4f9bf3]",
    },
    {
      name: "Main Course",
      value: categoryTotals["Main Course"],
      percentage:
        totalCategoryItems > 0
          ? Math.round(
              (categoryTotals["Main Course"] / totalCategoryItems) * 100,
            )
          : 0,
      barClass: "bg-[#10cf75]",
    },
    {
      name: "Beverages",
      value: categoryTotals.Beverages,
      percentage:
        totalCategoryItems > 0
          ? Math.round((categoryTotals.Beverages / totalCategoryItems) * 100)
          : 0,
      barClass: "bg-[#b36bea]",
    },
  ];

  /*
   * --------------------------------
   * TOP SELLING DISHES
   * --------------------------------
   */

  const dishData = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!dishData[item.name]) {
        dishData[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }

      dishData[item.name].quantity += Number(item.quantity || 0);

      dishData[item.name].revenue +=
        Number(item.quantity || 0) * (menuPrices[item.name] || 0);
    });
  });

  const topSellingDishes = Object.values(dishData)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const highestQuantity =
    topSellingDishes.length > 0 ? topSellingDishes[0].quantity : 0;

  /*
   * --------------------------------
   * NUMBER FORMATTING
   * --------------------------------
   */

  const formatCurrency = (value) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  return (
    <AdminLayout>
      <>
        <div className="min-h-screen bg-[#f9f6f1] px-4 py-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#171717]">Reports</h1>

              <p className="mt-1 text-sm text-[#a17d6c]">
                Weekly performance overview
              </p>
            </div>

            <div>
              <button
                onClick={() => navigate("/admin/report/feedbacks")}
                className="rounded-xl bg-[#d15d2c] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b95222]"
              >
                View Feedbacks
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total Revenue */}
            <div className="rounded-2xl border border-[#eadfd6] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece4] text-lg">
                📈
              </div>

              <p className="mt-4 text-2xl font-semibold text-[#171717]">
                {formatCurrency(totalRevenue)}
              </p>

              <p className="mt-1 text-sm text-[#8c786d]">Total Revenue</p>
            </div>

            {/* Average Order Value */}
            <div className="rounded-2xl border border-[#eadfd6] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece4] text-lg">
                💳
              </div>

              <p className="mt-4 text-2xl font-semibold text-[#171717]">
                {formatCurrency(averageOrderValue)}
              </p>

              <p className="mt-1 text-sm text-[#8c786d]">Avg Order Value</p>
            </div>

            {/* Items Sold */}
            <div className="rounded-2xl border border-[#eadfd6] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ece4] text-lg">
                📦
              </div>

              <p className="mt-4 text-2xl font-semibold text-[#171717]">
                {totalItemsSold}
              </p>

              <p className="mt-1 text-sm text-[#8c786d]">Items Sold</p>
            </div>
          </div>

          {/* Orders by Category */}
          <div className="mt-6 rounded-2xl border border-[#eadfd6] bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#171717]">
              Orders by Category
            </h2>

            <div className="mt-5 space-y-4">
              {categoryData.map((category) => (
                <div
                  key={category.name}
                  className="grid grid-cols-[95px_1fr_35px] items-center gap-3 sm:grid-cols-[100px_1fr_40px]"
                >
                  <p className="text-sm text-[#594c45]">{category.name}</p>

                  <div className="h-3 overflow-hidden rounded-full bg-[#eee7dd]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${category.barClass}`}
                      style={{
                        width: `${category.percentage}%`,
                      }}
                    />
                  </div>

                  <p className="text-right text-xs text-[#a17d6c]">
                    {category.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Dishes */}
          <div className="mt-6 rounded-2xl border border-[#eadfd6] bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#171717]">
              Top Selling Dishes
            </h2>

            <div className="mt-5 space-y-5">
              {topSellingDishes.map((dish, index) => {
                const percentage =
                  highestQuantity > 0
                    ? (dish.quantity / highestQuantity) * 100
                    : 0;

                return (
                  <div
                    key={dish.name}
                    className="grid grid-cols-[28px_1fr] gap-3 sm:grid-cols-[28px_1fr_90px]"
                  >
                    {/* Rank */}
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                        index === 0
                          ? "bg-[#fff1a8] text-[#a77800]"
                          : index === 1
                            ? "bg-[#f1f1f1] text-[#555]"
                            : index === 2
                              ? "bg-[#ffe7c7] text-[#e27c00]"
                              : "bg-[#f0e9df] text-[#725f53]"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Dish + Bar */}
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-[#171717]">
                          {dish.name}
                        </p>

                        <p className="shrink-0 text-xs font-medium text-[#d15d2c] sm:hidden">
                          {formatCurrency(dish.revenue)}
                        </p>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee7dd]">
                        <div
                          className="h-full rounded-full bg-[#d15d2c] transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Revenue + Quantity */}
                    <div className="hidden text-right sm:block">
                      <p className="text-xs font-medium text-[#d15d2c]">
                        {formatCurrency(dish.revenue)}
                      </p>

                      <p className="mt-1 text-[10px] text-[#a17d6c]">
                        {dish.quantity} sold
                      </p>
                    </div>
                  </div>
                );
              })}

              {topSellingDishes.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#8c786d]">
                    No sales data available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default Report;
