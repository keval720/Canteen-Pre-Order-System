import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../config/Firebase";
import { getAdminProfile } from "./userService";
import { db } from "../config/Firebase";
import { query, where } from "firebase/firestore";

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
  const verifyAndSubscribe = async () => {
    try {
      const user = auth.currentUser;

      console.log("Authenticated UID:", user?.uid);

      if (!user) {
        throw new Error("No authenticated Firebase user.");
      }

      const adminProfile = await getAdminProfile(user.uid);

      console.log("Authenticated UID:", user.uid);
      console.log("Admin document ID expected:", user.uid);
      console.log("Admin profile returned:", adminProfile);
      console.log("Admin role returned:", adminProfile?.role);

      return onSnapshot(
        orderCollection,
        (snapshot) => {
          onOrdersChange(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          );
        },
        (error) => {
          console.error("Orders Snapshot Error:", error);
          onError?.(error);
        },
      );
    } catch (error) {
      console.error("Admin verification failed:", error);
      onError?.(error);
    }
  };

  let unsubscribe = null;
  let cancelled = false;

  verifyAndSubscribe().then((listener) => {
    if (cancelled) {
      listener?.();
    } else {
      unsubscribe = listener;
    }
  });

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
};

export const subscribeToUserOrders = (userId, onOrdersChange, onError) => {
  const userOrdersQuery = query(
    orderCollection,
    where("userId", "==", userId),
  );

  return onSnapshot(
    userOrdersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onOrdersChange(orders);
    },
    (error) => {
      console.error("User Orders Snapshot Error:", error);
      onError?.(error);
    },
  );
};
