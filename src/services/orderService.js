import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../config/Firebase";

const orderCollection = collection(db, "orders");

// Get all orders
export const getOrders = async () => {
  const snapshot = await getDocs(orderCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

// Add new order
export const addOrder = async (orderData) => {
  const document = await addDoc(orderCollection, orderData);

  return {
    id: document.id,
    ...orderData,
  };
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  const orderRef = doc(db, "orders", id);

  await updateDoc(orderRef, {
    status: status,
  });
};

// Mark order as collected
export const markOrderAsCollected = async (id) => {
  const orderRef = doc(db, "orders", id);

  await updateDoc(orderRef, {
    status: "Delivered",
    pickupStatus: "collected",
  });
};

// Delete order
export const deleteOrder = async (id) => {
  const orderRef = doc(db, "orders", id);

  await deleteDoc(orderRef);
};

export const subscribeToOrders = (onOrdersChange, onError) => {
  return onSnapshot(
    orderCollection,
    (snapshot) => {
      const orders = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onOrdersChange(orders);
    },
    (error) => {
      console.error("Orders Snapshot Error:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};
