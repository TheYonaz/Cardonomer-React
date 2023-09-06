import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Card,
  CardHeader,
} from "@mui/material";
import { getUserPokemonDecks } from "../../cards/services/pokemonAPI";
import Posts from "../../layout/main/mid/post/Posts";
import { getPost, getUsersPost } from "../../posts/service/PostSystemAPI";
import UserDecks from "./UserDecks";
import { useUser } from "../providers/UserProvider";
import { useFriends } from "../friends/friendsProvider/FriendsProvider";
import ROUTES from "../../router/routesModel";
import { Announcement } from "@mui/icons-material";

const UserProfile = () => {
  const { user_id } = useParams();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [userDecks, setUserDecks] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const { friends } = useFriends();
  const navigate = useNavigate();

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
    const fetchUserDataAndPosts = async () => {
      try {
        const [userDataResponse, userDecksResponse, userPostsResponse] =
          await Promise.all([
            GetUser(user_id),
            getUserPokemonDecks(user_id),
            getUsersPost(user_id), // using the provided getUsersPost function
          ]);

        setUserData(userDataResponse);
        setUserDecks(userDecksResponse);
        setUserPosts(userPostsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserDataAndPosts();

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
                {user._id !== user_id && (
                  <Typography variant="body1" paragraph>
                    {/* You can add more user details here */}
                    Friend since:{console.log(userData)}
                    {friendshipStartDate
                      ? new Date(friendshipStartDate).toLocaleDateString()
                      : "Not friends"}
                  </Typography>
                )}
                {user._id === user_id && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(ROUTES.EDIT_USER)}
                  >
                    Edit
                  </Button>
                )}
                {/* Add more buttons or user actions here */}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      {userDecks.length > 0 ? (
        <UserDecks decks={userDecks} />
      ) : (
        <Card variant="outlined" style={{ marginTop: "20px" }}>
          <CardHeader
            avatar={<Announcement color="disabled" />}
            title="No Decks Available"
            subheader="User hasn't added any decks yet."
          />
        </Card>
      )}
      {userPosts.length > 0 ? (
        <Posts posts={userPosts} />
      ) : (
        <Card variant="outlined" style={{ marginTop: "20px" }}>
          <CardHeader
            avatar={<Announcement color="disabled" />}
            title="No Posts Available"
            subheader="User hasn't posted anything yet."
          />
        </Card>
      )}
    </Container>
  );
};

export default UserProfile;
