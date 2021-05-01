import React from "react";


import "./Navbar.css";
import logo from "./assets/LogoTrans.png"

const Navbar = (props: any) => {
  return (
    <div className="Navbar">
      <div className="navbar-container">
        <div className="icon-container">
          <img className="logo-icon" src={logo} alt={"granular-lending-logo"} /> 
          <h1>Granular Lending</h1>
        </div>
        
        <button disabled={props.disabled} onClick={props.onClick}>
          {props.loginButtonText}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
