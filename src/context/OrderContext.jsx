import { createContext, useContext, useEffect, useState } from "react";

import {
  getOrders,
  addOrder as addOrderToFirebase,
  updateOrderStatus as updateOrderStatusInFirebase,
  markOrderAsCollected as markOrderAsCollectedInFirebase,
  deleteOrder as deleteOrderFromFirebase,
} from "../services/orderService";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load orders from Firebase
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const firebaseOrders = await getOrders();

      setOrders(firebaseOrders);
    } catch (error) {
      console.error("Load Orders Error:", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Add order
  const addOrder = async (newOrder) => {
    try {
      const createdOrder = await addOrderToFirebase(newOrder);

      setOrders((previousOrders) => [...previousOrders, createdOrder]);

      return createdOrder;
    } catch (error) {
      console.error("Add Order Error:", error);
      throw error;
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatusInFirebase(id, status);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: status,
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Update Order Status Error:", error);

      throw error;
    }
  };

  // Mark order as collected
  const markOrderAsCollected = async (id) => {
    try {
      await markOrderAsCollectedInFirebase(id);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: "Delivered",
                pickupStatus: "collected",
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Mark Order As Collected Error:", error);

      throw error;
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await deleteOrderFromFirebase(id);

      setOrders((previousOrders) =>
        previousOrders.filter((order) => order.id !== id),
      );
    } catch (error) {
      console.error("Delete Order Error:", error);

      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        loadOrders,
        addOrder,
        updateOrderStatus,
        markOrderAsCollected,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders must be used inside OrderProvider");
  }

  return context;
};
