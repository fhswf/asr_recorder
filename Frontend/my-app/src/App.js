import './App.css';
import React from 'react';
import { RecorderWithAuthencation } from './Auth0Components';
import { BrowserRouter, Route } from 'react-router-dom';

function App() 
{
  return (
    <BrowserRouter basename="/asrRecorder">
        <Route path="/index" component={RecorderWithAuthencation} />
    </BrowserRouter>
  )
}

export default App;