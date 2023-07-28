import "./App.css";
import Layout from "./layout/Layout";
import Router from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./layout/header/menu/MenuProvider";

import { SnackBarProvider } from "./providers/SnackBarProvider";
import { UserProvider } from "./users/providers/UserProvider";
import { CommentProvider } from "./layout/main/mid/commentProvider/CommentProvider";
import { FriendsProvider } from "./users/friends/friendsProvider/FriendsProvider.jsx";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <FriendsProvider>
            <SnackBarProvider>
              <CommentProvider>
                <MenuProvider>
                  <Layout>
                    <Router />
                  </Layout>
                </MenuProvider>
              </CommentProvider>
            </SnackBarProvider>
          </FriendsProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
