import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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

// Delete order
export const deleteOrder = async (id) => {
  const orderRef = doc(db, "orders", id);

  await deleteDoc(orderRef);
};
