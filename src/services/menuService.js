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

const menuCollection = collection(db, "menu");

// Get all menu items
export const getMenu = async () => {
  const snapshot = await getDocs(menuCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

// Listen to menu changes in real time
export const subscribeToMenu = (onMenuChange, onError) => {
  return onSnapshot(
    menuCollection,
    (snapshot) => {
      const menuItems = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      onMenuChange(menuItems);
    },
    (error) => {
      console.error("Menu Snapshot Error:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};

// Add new menu item
export const addMenuItem = async (menuItem) => {
  const document = await addDoc(menuCollection, menuItem);

  return {
    id: document.id,
    ...menuItem,
  };
};

// Update menu item
export const updateMenuItem = async (id, updatedData) => {
  const menuRef = doc(db, "menu", id);

  await updateDoc(menuRef, updatedData);
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  const menuRef = doc(db, "menu", id);

  await deleteDoc(menuRef);
};
