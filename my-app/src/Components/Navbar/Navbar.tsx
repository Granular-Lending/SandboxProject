import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/LogoTrans.png";
import sandIcon from "./assets/sandIcon.png";
import Blockies from 'react-blockies';

import {
  Tooltip,
} from "@material-ui/core";

const Navbar = (props: any) => {
  return (
    <div className="Navbar" style={{ position: 'sticky', top: 0 }}>
      <div className="navbar-container">
        <Link style={{ textDecoration: "none" }} to="/">
          <div className="icon-container">
            <img className="logo-icon" src={logo} alt="logo" />
            <h1>Granular Lending</h1>
          </div>
        </Link>
        <div
          style={{
            display: "flex",
            fontSize: "1.3em",
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/assets">
            <div style={{ margin: 8, color: "white" }}>Assets</div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/yourLoans">
            <div style={{ margin: 8, color: "white" }}>Your Loans</div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/yourBorrows">
            <div style={{ margin: 8, color: "white" }}>Your Borrows</div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/permissions">
            <div style={{ margin: 8, color: "white" }}>Permissions</div>
          </Link>
        </div>

        <div>
          <button
            style={{ marginRight: 20 }}
            disabled={props.disabled}
            onClick={props.onClick}
          >
            {props.loginButtonText}
          </button>
          <Tooltip title={props.accounts[0]}>
            <Blockies
              seed={props.accounts[0]}
              size={10}
              scale={4}
              color={`#${props.accounts[0].slice(2, 5)}`}
              bgColor={`#${props.accounts[0].slice(2 + 3, 5 + 3)}`}
              spotColor={`#${props.accounts[0].slice(2 + 6, 5 + 6)}`}
              className="identicon"
            />
          </Tooltip>
        </div>
        <span>
          <img
            className="sandIcon"
            src={sandIcon}
            alt="SAND logo"
            style={{
              width: 30,
            }}
          />
          <b
            style={{
              color: "white",
              fontSize: "1.3em",
            }}
          >
            {props.sandBalance}
          </b>
        </span>
      </div>
    </div >
  );
};

export default Navbar;
