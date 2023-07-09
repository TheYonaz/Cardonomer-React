import { Routes, Route } from "react-router-dom";
import Card from "../cards/components/card/Card";
import Main from "../layout/main/mid/Main";
import MainPosts from "../layout/main/mid/MainPosts";
import ROUTES from "./routesModel";
const { ROOT, POKEMON_CARDS, WISHLIST_CARDS } = ROUTES;
const Router = () => {
  return (
    <Routes>
      <Route path={ROOT} element={<MainPosts />} />
      <Route path={POKEMON_CARDS} element={<Card />} />
    </Routes>
  );
};
export default Router;
