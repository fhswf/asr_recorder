import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Recorder from "./Recorder";
import env from "react-dotenv";
import './Auth0Components.css';

//Auth0-Login button using login-Function from Auth0
const LoginButton = () =>
{
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Anmelden / Registrieren</button>;
};

//Auth0-Logout button using logout-Function from Auth0
const LogoutButton = () =>
{
  const { logout } = useAuth0();
  let redirectUri = env.HOST_NAME + env.URI_BASENAME + env.URI_INDEX

  return (
    <button id="logoutButton" onClick={() => logout({ returnTo: redirectUri })}>
      Abmelden
    </button>
  );
};

//Element switching between login- and logout-button depending on isAuthenticated value
const LoginToggleButton = () => 
{
  const { isAuthenticated } = useAuth0();

  return(!isAuthenticated ? <LoginButton/> : <LogoutButton/>)
}

//Profile-Element with picture and username
const Profile = () => 
{
  const { user, isAuthenticated} = useAuth0();

  return (
    isAuthenticated && (
      <div id="profile">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
      </div>
    )
  );
};

//Main function for rendering the GUI
function RecorderWithAuthentication()
{
  const { user, isAuthenticated, isLoading } = useAuth0(); 
  const [accepted, setAccepted] = useState(false);
  
  let content;
  //show loading screen
  if (isLoading) 
  {
    content = <div id="loading">Lädt ...</div>;
  }
  //If user is logged out
  if(!isAuthenticated)
  {
    content = (
      <div id="login" >
        <h2>Willkommen!</h2>
        <p>Zum Fortfahren bitte anmelden oder registrieren</p>
        <p><LoginToggleButton/></p>
      </div>
    )
  }
  //open dialog for letter of acceptance
  if (isAuthenticated && !accepted)
  {
      content = (
      <div>
        <p><LoginToggleButton/></p>
        <p><Profile/></p>
        <div id="letterOfAcceptance">
          <h2>Einverständniserklärung</h2>
          <p>
            Hiermit akzeptiere ich, dass sprachliche Aufzeichnungen von mir sowie die dazugehörigen Kontodaten
            für wissenschaftliche Zwecke von der Fachhochschule Südwestfalen gespeichert und verwendet werden dürfen.
          </p>
          <button onClick={() => setAccepted(true)}>Akzeptieren</button>
        </div>
      </div>
      )
  }
  //User is logged in and has accepted the letter of acceptance -> rendering recorder element from recorder.js
  if (isAuthenticated && accepted)
  {
    content =  (
    <div>
      <p><LoginToggleButton/></p>
      <p><Profile/></p>
      <br/>
      <div id="recorder">
        <Recorder user={user.name}/>
      </div>
    </div>
  ) 
  }
  //return Application-Title with the current content
  return (
    <div>
      <p id="title">FH SWF <br/> Voice Collector</p>
      {content}
    </div>
  )
}

export {RecorderWithAuthentication};