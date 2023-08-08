import React, { useContext, useState, useEffect, useMemo } from "react";
import { node } from "prop-types";
import { removeFromCart, GetUserCart, addToCart } from "../service/userApi";
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
  const [cartLength, setCartLength] = useState(initialCart.length);

  useEffect(() => {
    const fetchCartItems = async (userId) => {
      try {
        const data = await GetUserCart(userId);
        setCartItems(data);
        setCartLength(data.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (user) fetchCartItems(user._id);
  }, [user]);

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

  const removeCartItem = async (cardId) => {
    if (!user) {
      const newCart = cartItems.filter((item) => item.id !== cardId);
      setCartItems(newCart);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      setCartLength(newCart.length);
      return;
    }

    try {
      await removeFromCart(user._id, cardId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cardId)
      );
      setCartLength((prevLength) => prevLength - 1);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const value = useMemo(() => {
    return { cartItems, cartLength, removeCartItem, addCartItem };
  }, [cartItems, cartLength]);

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
