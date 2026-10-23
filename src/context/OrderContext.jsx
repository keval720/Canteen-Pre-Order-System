import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../config/Firebase";
import { getAdminProfile } from "../services/userService";

import {
  addOrder as addOrderToFirebase,
  subscribeToOrders,
  subscribeToUserOrders,
  updateOrderStatus as updateOrderStatusInFirebase,
  markOrderAsCollected as markOrderAsCollectedInFirebase,
  deleteOrder as deleteOrderFromFirebase,
} from "../services/orderService";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeOrders = null;
    let active = true;
    let authCheckId = 0;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      const currentCheckId = ++authCheckId;

      unsubscribeOrders?.();
      unsubscribeOrders = null;

      setOrders([]);
      setError("");

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const adminProfile = await getAdminProfile(user.uid);

        if (!active || currentCheckId !== authCheckId) return;

        const handleOrders = (firebaseOrders) => {
          if (!active || currentCheckId !== authCheckId) return;

          setOrders(firebaseOrders);
          setLoading(false);
          setError("");
        };

        const handleError = (listenerError) => {
          if (!active || currentCheckId !== authCheckId) return;

          console.error("Orders Listener Error:", listenerError);
          setError("Failed to load orders.");
          setLoading(false);
        };

        if (adminProfile?.role === "admin") {
          unsubscribeOrders = subscribeToOrders(handleOrders, handleError);
        } else {
          unsubscribeOrders = subscribeToUserOrders(
            user.uid,
            handleOrders,
            handleError,
          );
        }
      } catch (listenerError) {
        if (!active || currentCheckId !== authCheckId) return;

        console.error("Order access verification failed:", listenerError);
        setError("Unable to verify account access for orders.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeOrders?.();
    };
  }, []);

  const addOrder = async (newOrder) => {
    try {
      return await addOrderToFirebase(newOrder);
    } catch (error) {
      console.error("Add Order Error:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatusInFirebase(id, status);
    } catch (error) {
      console.error("Update Order Status Error:", error);
      throw error;
    }
  };

  const markOrderAsCollected = async (id) => {
    try {
      await markOrderAsCollectedInFirebase(id);
    } catch (error) {
      console.error("Mark Order As Collected Error:", error);
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await deleteOrderFromFirebase(id);
    } catch (error) {
      console.error("Delete Order Error:", error);
      throw error;
    }
  };

  const loadOrders = async () => {
    // The real-time listener updates orders automatically.
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
