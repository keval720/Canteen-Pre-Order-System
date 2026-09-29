import { useState } from "react";
import { useOrders } from "../../context/OrderContext";

const OrderStatusControl = ({ order }) => {
  const { updateOrderStatus } = useOrders();

  const [updating, setUpdating] = useState(false);

  const statuses = ["Pending", "Preparing", "Waiting for Pickup", "Delivered"];

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (newStatus === order.status) {
      return;
    }

    try {
      setUpdating(true);

      await updateOrderStatus(order.id, newStatus);
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={order.status}
      onChange={handleStatusChange}
      disabled={updating}
      className="rounded-lg border border-[#e5d8cd] bg-white px-3 py-2 text-xs font-medium text-[#594c45] outline-none transition-colors focus:border-[#d15d2c] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusControl;
