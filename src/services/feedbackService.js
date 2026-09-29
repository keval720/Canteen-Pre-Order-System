import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../config/Firebase";

const feedbackCollection = collection(db, "feedback");

export const getFeedbacks = async () => {
  const snapshot = await getDocs(feedbackCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const addFeedback = async (feedbackData) => {
  const document = await addDoc(feedbackCollection, feedbackData);

  return {
    id: document.id,
    ...feedbackData,
  };
};

export const updateFeedback = async (id, updatedData) => {
  const feedbackRef = doc(db, "feedback", id);

  await updateDoc(feedbackRef, updatedData);
};

export const deleteFeedback = async (id) => {
  const feedbackRef = doc(db, "feedback", id);

  await deleteDoc(feedbackRef);
};
