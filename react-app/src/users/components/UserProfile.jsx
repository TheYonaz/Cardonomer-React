import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetUser } from "../service/userApi";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  Container,
} from "@mui/material";
import { getUserPokemonDecks } from "../../cards/services/pokemonAPI";
import Posts from "../../layout/main/mid/post/Posts";
import { getPost } from "../../posts/service/PostSystemAPI";
import UserDecks from "./UserDecks";
import { useUser } from "../providers/UserProvider";
import { useFriends } from "../friends/friendsProvider/FriendsProvider";

const UserProfile = () => {
  const { user_id } = useParams();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [userDecks, setUserDecks] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const { friends } = useFriends();

  const findFriendshipStartDate = (userId, friendsArray) => {
    console.log(userId);
    console.log(friendsArray);
    console.log(user._id);
    const friend = friendsArray.find((friend) => friend.user_id === userId);
    return friend ? friend.startOfFriendship : null;
  };

  const friendshipStartDate = userData
    ? findFriendshipStartDate(user_id, friends)
    : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetUser(user_id);
        console.log("fetchUserData", data);
        setUserData(data);
        const fetchUserPosts = async () => {
          if (data.publishedPosts) {
            console.log(data.publishedPosts);
            data.publishedPosts.forEach(async (post) => {
              console.log("post", post);
              try {
                const postData = await getPost(post._id);
                console.log("fetchUserPosts", postData);
                setUserPosts((prev) => [...prev, postData]);
              } catch (error) {}
            });
          }
        };
        fetchUserPosts();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchUserDecks = async () => {
      try {
        const data = await getUserPokemonDecks(user_id);
        console.log("fetchUserDecks", data);
        setUserDecks(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    fetchUserDecks();
    return () => {
      setUserData(null);
      setUserDecks([]);
      setUserPosts([]);
    };
  }, [user_id]);

  return (
    <Container>
      {userData && (
        <Box mt={4}>
          <Paper
            elevation={3}
            style={{ padding: "20px", borderRadius: "15px" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Avatar
                  src={userData.image.url}
                  alt={userData.image.alt}
                  sx={{ width: 200, height: 200, margin: "0 auto" }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  {`${userData.name.first} ${userData.name.last}`}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {userData.email}
                </Typography>
                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="body1" paragraph>
                  {/* You can add more user details here */}
                  Friend since:{console.log(userData)}
                  {friendshipStartDate
                    ? new Date(friendshipStartDate).toLocaleDateString()
                    : "Not friends"}
                </Typography>
                {user._id === user_id && (
                  <Button variant="contained" color="primary">
                    Edit
                  </Button>
                )}
                {/* Add more buttons or user actions here */}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      {userDecks[0] && <UserDecks decks={userDecks} />}
      {userPosts[0] && <Posts posts={userPosts} />}
    </Container>
  );
};

export default UserProfile;
