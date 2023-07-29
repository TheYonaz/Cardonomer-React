import { Routes, Route } from "react-router-dom";
import PokemonMain from "../cards/components/Pokemon/PokemonMain";
import PostsPage from "../posts/PostsPage";
import LoginPage from "../users/pages/LoginPage";
import SignUpPage from "../users/pages/SignUpPage";
import ROUTES from "./routesModel";
const { ROOT, POKEMON_CARDS } = ROUTES;
const Router = () => {
  return (
    <Routes>
      <Route path={ROOT} element={<PostsPage />} />
      <Route path={POKEMON_CARDS} element={<PokemonMain />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    </Routes>
  );
};
export default Router;
