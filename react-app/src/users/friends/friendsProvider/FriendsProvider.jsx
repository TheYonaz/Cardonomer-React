import React, { useCallback, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useUser } from "../../providers/UserProvider";
import { GetUserFriends } from "../../service/userApi";
const FriendsContext = React.createContext(null);
export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState([]);
  const { user } = useUser();
  console.log(user);
  const handleGetUserFriends = useCallback(
    async (userId) => {
      try {
        const userFriendsFromClient = await GetUserFriends(userId);
        console.log("handleGETFriends user", userFriendsFromClient);
        if (userFriendsFromClient) {
          return setFriends(userFriendsFromClient);
        }
      } catch (error) {
        if (typeof error === "string") return setError(error);
      }
    },
    [user]
  );
  useEffect(() => {
    if (user) {
      handleGetUserFriends(user._id);
    }
    console.log("useFriends", friends);
  }, [user, handleGetUserFriends]);

  return (
    <FriendsContext.Provider value={{ friends }}>
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
