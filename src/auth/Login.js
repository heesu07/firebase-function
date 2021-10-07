import React, { useState, useContext } from "react";
import firebase from "./../firebase";
import { AuthContext } from './Auth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        resetInput();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        resetInput();
        setCurrentUser(user)
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const logOut = () => {
    firebase.auth().signOut();
    setCurrentUser(null);
  };

  const resetInput = () => {
    setEmail("");
    setPassword("");
  };

  if(currentUser != null){
    return (
      <>
        <a className="logout" href="section" onClick={logOut}> Logout </a>
      </>
    );
  }
  else
    return (
    <>
      <h1>Login</h1>
      <div className="inputBox">
        <h3>Login/Register</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
        
      </div>
    </>
  );
};

export default Login;
