import { Routes, Route } from "react-router-dom";
import Card from "../cards/components/card/Card";
import MainPosts from "../layout/main/mid/MainPosts";
import LoginPage from "../users/pages/LoginPage";
import SignUpPage from "../users/pages/SignUpPage";
import ROUTES from "./routesModel";
const { ROOT, POKEMON_CARDS } = ROUTES;
const Router = () => {
  return (
    <Routes>
      <Route path={ROOT} element={<MainPosts />} />
      <Route path={POKEMON_CARDS} element={<Card />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
    </Routes>
  );
};
export default Router;
