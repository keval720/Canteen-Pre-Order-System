import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../config/Firebase";

const menuCollection = collection(db, "menu");

export const getMenu = async () => {
  const snapshot = await getDocs(menuCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const addMenuItem = async (menuItem) => {
  const document = await addDoc(menuCollection, menuItem);

  return {
    id: document.id,
    ...menuItem,
  };
};

export const updateMenuItem = async (id, updatedData) => {
  const menuRef = doc(db, "menu", id);

  await updateDoc(menuRef, updatedData);
};

export const deleteMenuItem = async (id) => {
  const menuRef = doc(db, "menu", id);

  await deleteDoc(menuRef);
};
