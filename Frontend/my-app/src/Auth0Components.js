import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Recorder from "./Recorder"

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

//TODO

const Profile = () => 
{
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

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

const RecorderWithAuthencation = () =>
{
  const { user, isAuthenticated, isLoading } = useAuth0(); 
  let recorder = isAuthenticated && <Recorder user={user.name}/>
  if (isLoading) {
    return <div>Loading ...</div>;
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