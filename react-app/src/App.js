import "./App.css";
import Layout from "./layout/Layout";
import Router from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./layout/header/menu/MenuProvider";

import { SnackBarProvider } from "./providers/SnackBarProvider";
import { UserProvider } from "./users/providers/UserProvider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <SnackBarProvider>
            <MenuProvider>
              <Layout>
                <Router />
              </Layout>
            </MenuProvider>
          </SnackBarProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
