import React, { useContext } from "react";
import { AuthContext } from "./auth/Auth";
//const firebase = require("firebase-function");
// Required for side-effects
require("firebase/functions");


const Welcome = () => {
  const { currentUser } = useContext(AuthContext);
  const currentUserEmail = currentUser ? currentUser.email : "";

  
  return (
    <>
      <h3 className="user">{`Welcome ${currentUserEmail}`}</h3>
    </>
  );
};

export default Welcome;
