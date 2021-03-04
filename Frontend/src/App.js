import './App.css';
import React from 'react';
import { RecorderWithAuthentication } from './Auth0Components';
import { BrowserRouter, Route } from 'react-router-dom';
import env from "react-dotenv";

function App() 
{
  return (
    <BrowserRouter basename={env.URI_BASENAME}>
        <Route path={env.INDEX} component={RecorderWithAuthentication} />
    </BrowserRouter>
  )
}

export default App;