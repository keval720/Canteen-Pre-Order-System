import { createContext, useContext, useEffect, useState } from "react";

import {
  addOrder as addOrderToFirebase,
  subscribeToOrders,
  updateOrderStatus as updateOrderStatusInFirebase,
  markOrderAsCollected as markOrderAsCollectedInFirebase,
  deleteOrder as deleteOrderFromFirebase,
} from "../services/orderService";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Listen to orders in real time
  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubscribe = subscribeToOrders(
      (firebaseOrders) => {
        setOrders(firebaseOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Orders Listener Error:", error);
        setError("Failed to load orders.");
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Add order
  const addOrder = async (newOrder) => {
    try {
      const createdOrder = await addOrderToFirebase(newOrder);

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
    } catch (error) {
      console.error("Update Order Status Error:", error);

      throw error;
    }
  };

  // Mark order as collected
  const markOrderAsCollected = async (id) => {
    try {
      await markOrderAsCollectedInFirebase(id);
    } catch (error) {
      console.error("Mark Order As Collected Error:", error);

      throw error;
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await deleteOrderFromFirebase(id);
    } catch (error) {
      console.error("Delete Order Error:", error);

      throw error;
    }
  };

  // Manually reload orders if needed
  const loadOrders = async () => {
    // Real-time listener already keeps orders updated.
    // This function is kept for compatibility with existing screens.
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
