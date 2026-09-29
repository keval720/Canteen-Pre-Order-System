import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "../config/Firebase";

export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  await sendEmailVerification(userCredential.user);

  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
