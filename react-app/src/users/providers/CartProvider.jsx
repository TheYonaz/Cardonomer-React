import React, { useContext, useState, useEffect, useMemo } from "react";
import { node } from "prop-types";
import {
  removeFromCart,
  GetUserCart,
  addToCart,
  getPrizes,
  addAllToCart,
} from "../service/userApi";
import { useUser } from "./UserProvider";

// Create the context
export const CartContext = React.createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useUser();

  // Initialize cart from local storage for guests
  const initialCart = user
    ? []
    : JSON.parse(localStorage.getItem("guestCart") || "[]");

  const [cartItems, setCartItems] = useState(initialCart);
  const [prizes, setPrizes] = useState([]);
  const [cartLength, setCartLength] = useState(initialCart.length);

  const addCartItem = async (cardId) => {
    if (!user) {
      const newCart = [...cartItems, cardId];
      setCartItems(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      setCartLength(newCart.length);
      return;
    }

    try {
      const data = await addToCart(user._id, cardId);
      setCartItems((prevItems) => [...prevItems, data]);
      setCartLength((prevLength) => prevLength + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleAddAllToCart = async (cart, userID) => {
    if (!Array.isArray(cart)) {
      console.error("cart is not an array:", cart);
      return;
    }
    const formattedCart = cart.map((item) => ({ _id: item._id }));
    try {
      const data = await addAllToCart(formattedCart, userID);
      if (data) {
        setCartItems((prevItems) => [...prevItems, ...data]);
        setCartLength((prevLength) => prevLength + formattedCart.length);
      }
    } catch (error) {
      console.error("Error adding all to cart:", error);
    }
  };

  const removeCartItem = async (cardId) => {
    if (!user) {
      const indexToRemove = cartItems.findIndex((item) => item._id === cardId);

      if (indexToRemove !== -1) {
        const newCart = [...cartItems];
        newCart.splice(indexToRemove, 1);
        setCartItems(newCart);
        localStorage.setItem("guestCart", JSON.stringify(newCart));
        setCartLength(newCart.length);
      }
      return;
    }

    try {
      await removeFromCart(user._id, cardId);
      const indexToRemove = cartItems.findIndex((item) => item._id === cardId);

      if (indexToRemove !== -1) {
        const newCartItems = [...cartItems];
        newCartItems.splice(indexToRemove, 1);
        setCartItems(newCartItems);
        setCartLength((prevLength) => prevLength - 1);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  useEffect(() => {
    if (!user) return;
    const fetchCartItems = async (userId) => {
      try {
        const data = await GetUserCart(userId);
        console.log("fetchCartItems", data);
        setCartItems(data);
        setCartLength(data.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const fetchPrizes = async (userId) => {
      try {
        const data = await getPrizes(userId);
        console.log("Prizes:", data);
        setPrizes(data);
      } catch (error) {
        console.error("Error fetching prizes:", error);
      }
    };

    const mergeGuestCartWithUserCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      for (let cardId of guestCart) {
        await addCartItem(cardId);
      }
      localStorage.removeItem("guestCart");
    };

    if (user) {
      fetchCartItems(user._id);
      fetchPrizes(user._id);
      mergeGuestCartWithUserCart();
    }
    console.log("cartItems", cartItems);
    return () => {
      setCartItems([]);
      setCartLength(0);
      setPrizes([]);
    };
  }, [user]);

  const value = useMemo(() => {
    return {
      cartItems,
      cartLength,
      removeCartItem,
      addCartItem,
      prizes,
      handleAddAllToCart,
    };
  }, [cartItems, cartLength, prizes]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

CartProvider.propTypes = {
  children: node.isRequired,
};
