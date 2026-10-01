import { deleteDoc, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "../config/Firebase";

// ==========================================
// ADMIN
// ==========================================

const adminProfileRef = doc(db, "users", "admin");

export const getAdminProfile = async () => {
  const snapshot = await getDoc(adminProfileRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const saveAdminProfile = async (profileData) => {
  await setDoc(adminProfileRef, profileData, {
    merge: true,
  });

  return {
    id: "admin",
    ...profileData,
  };
};

// ==========================================
// PENDING REGISTRATION
// ==========================================

export const savePendingRegistration = async (userId, userData) => {
  const pendingRef = doc(db, "pendingRegistrations", userId);

  const pendingData = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };

  await setDoc(pendingRef, pendingData);

  return {
    id: userId,
    ...pendingData,
  };
};

export const getPendingRegistration = async (userId) => {
  const pendingRef = doc(db, "pendingRegistrations", userId);

  const snapshot = await getDoc(pendingRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const deletePendingRegistration = async (userId) => {
  const pendingRef = doc(db, "pendingRegistrations", userId);

  await deleteDoc(pendingRef);
};

// ==========================================
// USER PROFILE
// ==========================================

export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, "users", userId);

  const profileData = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    phone: userData.phone || "",
    favourites: [],
  };

  await setDoc(userRef, profileData, {
    merge: true,
  });

  return {
    id: userId,
    ...profileData,
  };
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================

export const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(db, "users", userId);

  const updateData = {
    name: profileData.name,
    phone: profileData.phone || "",
  };

  await setDoc(userRef, updateData, {
    merge: true,
  });

  return {
    id: userId,
    ...updateData,
  };
};

// ==========================================
// USER FAVOURITES
// ==========================================

export const getUserFavourites = async (userId) => {
  const userRef = doc(db, "users", userId);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return [];
  }

  const userData = snapshot.data();

  return Array.isArray(userData.favourites) ? userData.favourites : [];
};

export const updateUserFavourites = async (userId, favourites) => {
  const userRef = doc(db, "users", userId);

  await setDoc(
    userRef,
    {
      favourites,
    },
    {
      merge: true,
    },
  );

  return favourites;
};

// ==========================================
// REAL-TIME USER FAVOURITES
// ==========================================

export const subscribeToUserFavourites = (
  userId,
  onFavouritesChange,
  onError,
) => {
  const userRef = doc(db, "users", userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onFavouritesChange([]);
        return;
      }

      const userData = snapshot.data();

      const favourites = Array.isArray(userData.favourites)
        ? userData.favourites
        : [];

      onFavouritesChange(favourites);
    },
    (error) => {
      console.error("Favourites Snapshot Error:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};
