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
import useAxios from "../../hooks/useAxios";

// Create the context
export const CartContext = React.createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  useAxios();

  // Initialize cart from local storage for guests
  const initialCart = user
    ? []
    : JSON.parse(localStorage.getItem("guestCart") || "[]");

  const [cartItems, setCartItems] = useState(initialCart);
  const [prizes, setPrizes] = useState([]);
  const [cartLength, setCartLength] = useState(initialCart.length);

  const addCartItem = React.useCallback(async (cardId) => {
    if (!user) {
      setCartItems((prevCart) => {
        const newCart = [...prevCart, cardId];
        localStorage.setItem("guestCart", JSON.stringify(newCart));
        setCartLength(newCart.length);
        return newCart;
      });
      return;
    }

    try {
      const data = await addToCart(user._id, cardId);
      setCartItems((prevItems) => [...prevItems, data]);
      setCartLength((prevLength) => prevLength + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [user]);

  const handleAddAllToCart = React.useCallback(async (cart, userID) => {
    if (!Array.isArray(cart)) {
      console.error("cart is not an array:", cart);
      return;
    }
    const formattedCart = cart.map((item) => ({ _id: item._id || item }));
    try {
      const data = await addAllToCart(formattedCart, userID);
      if (data) {
        setCartItems((prevItems) => [...prevItems, ...data]);
        setCartLength((prevLength) => prevLength + formattedCart.length);
      }
    } catch (error) {
      console.error("Error adding all to cart:", error);
    }
  }, []);

  const removeCartItem = React.useCallback(async (cardId) => {
    if (!user) {
      setCartItems((prevCart) => {
        const indexToRemove = prevCart.findIndex((item) => item._id === cardId);
        if (indexToRemove !== -1) {
          const newCart = [...prevCart];
          newCart.splice(indexToRemove, 1);
          localStorage.setItem("guestCart", JSON.stringify(newCart));
          setCartLength(newCart.length);
          return newCart;
        }
        return prevCart;
      });
      return;
    }

    try {
      await removeFromCart(user._id, cardId);
      setCartItems((prevItems) => {
        const indexToRemove = prevItems.findIndex((item) => item._id === cardId);
        if (indexToRemove !== -1) {
          const newCartItems = [...prevItems];
          newCartItems.splice(indexToRemove, 1);
          setCartLength((prevLength) => prevLength - 1);
          return newCartItems;
        }
        return prevItems;
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  }, [user]);
  useEffect(() => {
    if (!user) return;
    
    const fetchCartItems = async (userId) => {
      try {
        const data = await GetUserCart(userId);
        setCartItems(data);
        setCartLength(data.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const fetchPrizes = async (userId) => {
      try {
        const data = await getPrizes(userId);
        setPrizes(data);
      } catch (error) {
        console.error("Error fetching prizes:", error);
      }
    };

    const mergeGuestCartWithUserCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length > 0) {
        try {
          await handleAddAllToCart(guestCart, user._id);
          localStorage.removeItem("guestCart");
        } catch (error) {
          console.error("Error merging guest cart:", error);
        }
      }
    };

    fetchCartItems(user._id);
    fetchPrizes(user._id);
    mergeGuestCartWithUserCart();

    return () => {
      setCartItems([]);
      setCartLength(0);
      setPrizes([]);
    };
  }, [user?._id]);

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
