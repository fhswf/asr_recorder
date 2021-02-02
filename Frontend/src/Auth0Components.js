import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Recorder from "./Recorder";


const LoginButton = () =>
{
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () =>
{
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: 'http://localhost:3000/asrRecorder/index' })}>
      Log Out 
    </button>
  );
};

const LoginToggleButton = () => 
{
  const { isAuthenticated } = useAuth0();

  return(!isAuthenticated ? <LoginButton/> : <LogoutButton/>)
}

const Profile = () => 
{
  const { user, isAuthenticated} = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

function RecorderWithAuthencation()
{
  const { user, isAuthenticated, isLoading } = useAuth0(); 
  const [accepted, setAccepted] = useState(false);
  
  let recorder = isAuthenticated && <Recorder user={user.name}/>
  
  //show loading screen
  if (isLoading) 
  {
    return <div>Loading ...</div>;
  }
  //open dialog for letter of acceptance
  if (isAuthenticated && !accepted)
  {
      return(
      <div>
        <p><LoginToggleButton/></p>
        <h3>Einverständniserklärung</h3>
        <p>
          Hiermit akzeptiere ich, dass sprachliche Aufzeichnungen von mir sowie die dazugehörigen Kontodaten <br/>
          für wissenschaftliche Zwecke von der Fachhochschule Südwestfalen gespeichert und verwendet werden dürfen.
        </p>
        <button onClick={() => setAccepted(true)}>Akzeptieren</button>
      </div>
      )
  }
  return (
    <div>
      <p><LoginToggleButton/></p>
      <Profile/>
      <br/>
      {recorder}
    </div>
  ) 
}

export {RecorderWithAuthencation};