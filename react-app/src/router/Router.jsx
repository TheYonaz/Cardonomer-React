import { Routes, Route } from "react-router-dom";
import PokemonMain from "../cards/components/Pokemon/PokemonMain";
import MainGraph from "../cards/graph/MainGraph";
import PostsPage from "../posts/PostsPage";
import UserProfile from "../users/components/UserProfile";
import UsersManagment from "../users/components/UsersManagment";
import Cart from "../users/pages/cart/Cart";
import EditUserPage from "../users/pages/EditUserPage";
import LoginPage from "../users/pages/LoginPage";
import SignUpPage from "../users/pages/SignUpPage";
import ForgotPasswordPage from "../users/pages/ForgotPasswordPage";
import ResetPasswordPage from "../users/pages/ResetPasswordPage";
import EmailVerificationPage from "../users/pages/EmailVerificationPage";
import EmailManagementPage from "../users/pages/admin/EmailManagementPage";
import NotFound from "../layout/components/NotFound";
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
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.VERIFY_EMAIL} element={<EmailVerificationPage />} />
      <Route path={ROUTES.EDIT_USER} element={<EditUserPage />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.ADMIN} element={<UsersManagment />} />
      <Route path={ROUTES.ADMIN_EMAILS} element={<EmailManagementPage />} />
      <Route path={`${ROUTES.PROFILE}/:user_id`} element={<UserProfile />} />
      <Route path={ROUTES.GRAPH} element={<MainGraph />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
