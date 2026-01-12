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
import { getUsersPost } from "../../posts/service/PostSystemAPI";
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
  const { friends, handleFollowToggle } = useFriends();
  const [isFollowing, setIsFollowing] = useState(false);

  const navigate = useNavigate();

  const findFriendshipStartDate = (userId, friendsArray) => {
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
            getUsersPost(user_id),
          ]);

        setUserData(userDataResponse);
        setUserDecks(userDecksResponse || []);
        setUserPosts(userPostsResponse || []);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
        setUserData(null);
        setUserDecks([]);
        setUserPosts([]);
      }
    };

    if (user_id) {
      fetchUserDataAndPosts();
    }

    return () => {
      setUserData(null);
      setUserDecks([]);
      setUserPosts([]);
    };
  }, [user_id]);

  useEffect(() => {
    setIsFollowing(friends.some((friend) => friend.user_id === user_id));
  }, [friends, user_id]);

  return (
    <Container>
      {userData && (
        <Box mt={4}>
          <Paper
            elevation={3}
            sx={{ padding: "20px", borderRadius: "15px" }}
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
                <Divider sx={{ margin: "20px 0" }} />
                {user && user._id !== user_id && (
                  <Typography variant="body1" paragraph>
                    Friend since:{" "}
                    {friendshipStartDate
                      ? new Date(friendshipStartDate).toLocaleDateString()
                      : "Not friends"}
                  </Typography>
                )}
                {user && user._id === user_id && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(ROUTES.EDIT_USER)}
                  >
                    Edit
                  </Button>
                )}
                {user && user._id !== user_id && (
                  <Button
                    variant="contained"
                    color={isFollowing ? "secondary" : "primary"}
                    onClick={() => handleFollowToggle(userData._id)}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      {userDecks.length > 0 ? (
        <UserDecks decks={userDecks} />
      ) : (
        <Card variant="outlined" sx={{ marginTop: "20px" }}>
          <CardHeader
            avatar={<Announcement color="disabled" />}
            title="No Decks Available"
            subheader="User hasn't added any decks yet."
          />
        </Card>
      )}
      {userPosts.length > 0 ? (
        <Posts posts={userPosts} enableActionBar={false} />
      ) : (
        <Card variant="outlined" sx={{ marginTop: "20px" }}>
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
