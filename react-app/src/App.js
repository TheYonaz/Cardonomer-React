import logo from "./logo.svg";
import "./App.css";

import Layout from "./layout/Layout";
import Router from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import { MenuProvider } from "./layout/header/menu/MenuProvider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MenuProvider>
          <Layout>
            <Router />
          </Layout>
        </MenuProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
