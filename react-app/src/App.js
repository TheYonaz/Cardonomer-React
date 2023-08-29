import "./App.css";
import Layout from "./layout/Layout";
import Router from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./layout/header/menu/MenuProvider";
import { SnackBarProvider } from "./providers/SnackBarProvider";
import { UserProvider } from "./users/providers/UserProvider";
import { FriendsProvider } from "./users/friends/friendsProvider/FriendsProvider.jsx";
import { DeckProvider } from "./cards/deckProvider/DeckProvider";
import { CartProvider } from "./users/providers/CartProvider";
import ScrollbarStyles from "./styles/styles";
// import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <div className="App">
      <ScrollbarStyles />
      <BrowserRouter>
        <UserProvider>
          <SnackBarProvider>
            <FriendsProvider>
              <CartProvider>
                <MenuProvider>
                  <DeckProvider>
                    <Layout>
                      <Router />
                    </Layout>
                  </DeckProvider>
                </MenuProvider>
              </CartProvider>
            </FriendsProvider>
          </SnackBarProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
