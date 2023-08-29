import { Routes, Route } from "react-router-dom";
import PokemonMain from "../cards/components/Pokemon/PokemonMain";
import MapGame from "../mapBox/components/Map";
import PostsPage from "../posts/PostsPage";
import UserProfile from "../users/components/UserProfile";
import UsersManagment from "../users/components/UsersManagment";
import Cart from "../users/pages/cart/Cart";
import LoginPage from "../users/pages/LoginPage";
import SignUpPage from "../users/pages/SignUpPage";
import { useUser } from "../users/providers/UserProvider";
import ROUTES from "./routesModel";
const { ROOT, POKEMON_CARDS } = ROUTES;
const Router = () => {
  const { user } = useUser();
  return (
    <Routes>
      <Route path={ROOT} element={user ? <PostsPage /> : <PokemonMain />} />
      <Route path={POKEMON_CARDS} element={<PokemonMain />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.ADMIN} element={<UsersManagment />} />
      <Route path={`${ROUTES.PROFILE}/:user_id`} element={<UserProfile />} />
      <Route path={ROUTES.MAP} element={<MapGame />} />
    </Routes>
  );
};
export default Router;
