import React, { useCallback, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useUser } from "../../providers/UserProvider";
import { GetUserFriends, toggleFollowUser } from "../../service/userApi";

const FriendsContext = React.createContext(null);

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState([]);
  const { user } = useUser();
  const handleGetUserFriends = useCallback(
    async (userId) => {
      try {
        const userFriendsFromClient = await GetUserFriends(userId);
        if (userFriendsFromClient) {
          return setFriends(userFriendsFromClient);
        }
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );
  const handleFollowToggle = async (viewedUserId) => {
    try {
      await toggleFollowUser(user._id, viewedUserId);
      handleGetUserFriends(user._id);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  useEffect(() => {
    if (user) {
      handleGetUserFriends(user._id);
    }
    return;
  }, [user]);
  // Assuming you pass `viewedUserId` into the FriendsProvider

  return (
    <FriendsContext.Provider value={{ friends, handleFollowToggle }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context)
    throw new Error("useFriends must be used within a FriendsProvider");
  return context;
};
