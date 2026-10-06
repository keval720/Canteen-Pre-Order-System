import { deleteDoc, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "../config/Firebase";

// ==========================================
// ADMIN
// ==========================================

export const getAdminProfile = async (userId) => {
  const adminRef = doc(db, "admins", userId);

  const snapshot = await getDoc(adminRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// ==========================================
// REAL-TIME ADMIN PROFILE
// ==========================================

export const subscribeToAdminProfile = (userId, onProfileChange, onError) => {
  const adminRef = doc(db, "admins", userId);

  return onSnapshot(
    adminRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfileChange(null);
        return;
      }

      onProfileChange({
        id: snapshot.id,
        ...snapshot.data(),
      });
    },
    (error) => {
      console.error("Admin Profile Snapshot Error:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};

export const saveAdminProfile = async (userId, profileData) => {
  const adminRef = doc(db, "admins", userId);

  await setDoc(adminRef, profileData, {
    merge: true,
  });

  return {
    id: userId,
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

// ==========================================
// REAL-TIME USER PROFILE
// ==========================================

export const subscribeToUserProfile = (userId, onProfileChange, onError) => {
  const userRef = doc(db, "users", userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfileChange(null);
        return;
      }

      onProfileChange({
        id: snapshot.id,
        ...snapshot.data(),
      });
    },
    (error) => {
      console.error("User Profile Snapshot Error:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};
