import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./index.css";
import "./App.scss";
import config from './config';

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthContextProvider } from "./components/contexts/Auth";
import ErrorContext from "./components/contexts/error/errorContext";
import DownloadTransactions from "./components/views/DownloadTransactions";
import DownloadBills from "./components/views/DownloadBills";
import PrintBill from "./components/views/PrintBill";

Sentry.init({
  dsn: config.sentryLogs,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});


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
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact={true} path={`/Receipts/:billId/:flatId/:transactionId`} component={DownloadTransactions} />
        <Route exact={true} path={`/Receipts/:billId/:flatId`} component={DownloadTransactions} />
        <Route exact={true} path={`/PrintBill/:billType/:billId`} component={PrintBill} />
        <Route exact={true} path={`/Bills/:billType`} component={DownloadBills} />
        <Fragment>
          <ErrorContext>
            <Route path="/" component={Dashboard} />
            <Route exact={true} path="/login" component={Login} />
            {/* <Route component={HomePage} />*/}
          </ErrorContext>
        </Fragment>
      </Switch>
    </BrowserRouter>
  </RootProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
