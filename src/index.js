import React from "react";
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import history from "./utils/history";
import { getConfig } from "./config";
import auth_config from "./auth_config.json";

// ReactDOM.render(
//   <Auth0Provider
//     domain="kxqkxff8.us.auth0.com"
//     clientId="skjd2PTxmc6PCrVrLY0HsYlJ0dHMAcnu"
//     authroizationParams={{
//       redirect_uri: window.location.origin,
//     }}
//     >
//     <App />
//     </Auth0Provider>,
//     document.getElementById('app')
// );


const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: auth_config.domain,
  clientId: auth_config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

const root = createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    {...providerConfig}
  >
    <App />
  </Auth0Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
