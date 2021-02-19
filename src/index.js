//#region Modules

//#region 3rd party app
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//#endregion

//#region Inbuilt
import "./index.css";
import "./App.scss";
//Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContextProvider } from "./components/contexts/Auth";
import ErrorContext from "./components/contexts/error/errorContext";
//#endregion

//#endregion

const providers = [[AuthContextProvider, {}]];

const combineProviders = (providers) => {
  const RootProvider = ({ children }) =>
    providers.reduceRight(
      (tree, [Provider, props]) => <Provider {...props}>{tree}</Provider>,
      children
    );
  return RootProvider;
};

const RootProvider = combineProviders(providers);

const App = () => (
  <RootProvider>
    <BrowserRouter>
      <Switch>
        <ErrorContext>
        <Route path="/" component={Dashboard} />
        <Route exact={true} path="/login" component={Login} />
        <Route component={HomePage} />
        </ErrorContext>
      </Switch>
    </BrowserRouter>
  </RootProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
