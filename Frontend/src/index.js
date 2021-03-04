import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import env from "react-dotenv";

const redirectUri = env.HOST_NAME + env.URI_BASENAME + env.URI_INDEX

//implements React.StrictMode and Auth0-Provider, calls App-Element from App.js
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={env.AUTH_ZERO_DOMAIN}
      clientId={env.AUTH_ZERO_CLIENT_ID}
      redirectUri={redirectUri}>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

