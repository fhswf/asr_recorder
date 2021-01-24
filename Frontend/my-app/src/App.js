import './App.css';
import React from 'react';
import Recorder from './Recorder';
import { BrowserRouter, Route } from 'react-router-dom';

function App() 
{
  return (
    <BrowserRouter basename="/asrRecorder">
      <Route path="/index" component={Recorder} />
    </BrowserRouter>
  )
}

export default App;