import React from "react";
import {
  Link
} from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/LogoTrans.png"

const Navbar = (props: any) => {
  return (
    <div className="Navbar">
      <div className="navbar-container">
        <div className="icon-container">
          <img className="logo-icon" src={logo} alt="logo" />
          <h1>Granular Lending</h1>
        </div>
        <div style={{
          backgroundColor: 'white',
          display: "flex",
          fontSize: "1.3em"
        }}>
          <div style={{ margin: 8 }}>
            <Link to="/">Home</Link>
          </div>
          <div style={{ margin: 8 }}>
            <Link to="/assets">Assets</Link>
          </div>
        </div>

        <button disabled={props.disabled} onClick={props.onClick}>
          {props.loginButtonText}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
