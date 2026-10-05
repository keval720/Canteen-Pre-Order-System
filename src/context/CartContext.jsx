import { createContext, useContext, useEffect, useState } from "react";

import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { db } from "../config/Firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LISTEN TO CART FROM FIRESTORE IN REAL TIME
  // ==========================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    setLoading(true);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();

          setCartItems(Array.isArray(userData.cart) ? userData.cart : []);
        } else {
          setCartItems([]);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Cart Listener Error:", error);

        setCartItems([]);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user, authLoading]);

  // ==========================================
  // SAVE CART TO FIRESTORE
  // ==========================================

  const saveCart = async (updatedCart) => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    const userRef = doc(db, "users", user.uid);

    await setDoc(
      userRef,
      {
        cart: updatedCart,
      },
      {
        merge: true,
      },
    );
  };

  // ==========================================
  // ADD ITEM
  // ==========================================

  const addToCart = async (item) => {
    if (!user) {
      throw new Error("Please login to add items to cart.");
    }

    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              preparationTime: Number(item.preparationTime || 0),
              batchable: item.batchable === true,
            }
          : cartItem,
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category || "",
          price: Number(item.price || 0),
          image: item.image || item.imageUrl || "",
          quantity: 1,
          preparationTime: Number(item.preparationTime || 0),
          batchable: item.batchable === true,
        },
      ];
    }

    await saveCart(updatedCart);
  };

  // ==========================================
  // REORDER ITEMS
  // ==========================================

  const reorderItems = async (orderItems) => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error("This order has no items to reorder.");
    }

    const updatedCart = [...cartItems];

    orderItems.forEach((orderItem) => {
      const existingItemIndex = updatedCart.findIndex(
        (cartItem) => cartItem.id === orderItem.id,
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity:
            Number(updatedCart[existingItemIndex].quantity || 0) +
            Number(orderItem.quantity || 0),
        };
      } else {
        updatedCart.push({
          id: orderItem.id,
          name: orderItem.name,
          description: orderItem.description || "",
          category: orderItem.category || "",
          price: Number(orderItem.price || 0),
          image: orderItem.image || orderItem.imageUrl || "",
          quantity: Number(orderItem.quantity || 1),
          preparationTime: Number(orderItem.preparationTime || 0),
          batchable: orderItem.batchable === true,
        });
      }
    });

    await saveCart(updatedCart);
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = async (itemId) => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    await saveCart(updatedCart);
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = async (itemId) => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    const existingItem = cartItems.find((item) => item.id === itemId);

    if (!existingItem) {
      return;
    }

    if (existingItem.quantity <= 1) {
      await removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item,
    );

    await saveCart(updatedCart);
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeFromCart = async (itemId) => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    const updatedCart = cartItems.filter((item) => item.id !== itemId);

    await saveCart(updatedCart);
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    if (!user) {
      throw new Error("Please login to manage your cart.");
    }

    await saveCart([]);
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // ==========================================
  // ITEM TOTAL
  // ==========================================

  const itemTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  // ==========================================
  // GST 5%
  // ==========================================

  const gst = itemTotal * 0.05;

  // ==========================================
  // CONVENIENCE FEE
  // ==========================================

  const convenienceFee = 0;

  // ==========================================
  // FINAL TOTAL
  // ==========================================

  const total = itemTotal + gst + convenienceFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,

        addToCart,
        reorderItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,

        totalItems,
        itemTotal,
        gst,
        convenienceFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export default CartContext;
