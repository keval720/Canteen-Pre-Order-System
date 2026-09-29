import { useOrders } from "../../context/OrderContext";
import OrderStatusControl from "./OrderStatusControl";

const OrderTable = () => {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-[#695950]">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-[#eadfd6] bg-white px-4 py-12 text-center text-sm text-[#695950]">
        No orders found.
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto rounded-xl border border-[#eadfd6] bg-white md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#eadfd6] bg-[#faf7f3] text-left">
              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Order ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Customer
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Items
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Total
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Pickup Time
              </th>

              <th className="px-5 py-4 text-xs font-semibold text-[#695950]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#f0e8e1] last:border-b-0"
              >
                <td className="px-5 py-4 text-sm font-semibold text-[#403630]">
                  {order.orderId || order.id}
                </td>

                <td className="px-5 py-4 text-sm text-[#594c45]">
                  {order.customer || "Unknown"}
                </td>

                <td className="px-5 py-4 text-sm text-[#594c45]">
                  {order.items?.length
                    ? order.items
                        .map((item) => `${item.name} (${item.quantity})`)
                        .join(", ")
                    : "No items"}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#403630]">
                  ₹{order.total || 0}
                </td>

                <td className="px-5 py-4 text-sm text-[#594c45]">
                  {order.pickupTime || "-"}
                </td>

                <td className="px-5 py-4">
                  <OrderStatusControl order={order} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-[#eadfd6] bg-white p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#403630]">
                  {order.orderId || order.id}
                </p>

                <p className="mt-1 text-xs text-[#806f65]">
                  {order.customer || "Unknown"}
                </p>
              </div>

              <OrderStatusControl order={order} />
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-[#806f65]">Items: </span>
                <span className="text-[#594c45]">
                  {order.items?.length
                    ? order.items
                        .map((item) => `${item.name} (${item.quantity})`)
                        .join(", ")
                    : "No items"}
                </span>
              </div>

              <div>
                <span className="text-[#806f65]">Total: </span>
                <span className="font-medium text-[#403630]">
                  ₹{order.total || 0}
                </span>
              </div>

              <div>
                <span className="text-[#806f65]">Pickup: </span>
                <span className="text-[#594c45]">
                  {order.pickupTime || "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderTable;
