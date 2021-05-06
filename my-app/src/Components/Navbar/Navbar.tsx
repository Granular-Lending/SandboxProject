import {
  Link
} from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/LogoTrans.png"
import sandIcon from "./assets/sandIcon.png";

const Navbar = (props: any) => {
  return (
    <div className="Navbar">
      <div className="navbar-container">
        <div className="icon-container">
          <img className="logo-icon" src={logo} alt="logo" />
          <h1>Granular Lending</h1>
        </div>
        <div style={{
          display: "flex",
          fontSize: "1.3em"
        }}>
          <Link to="/">
            <div style={{ margin: 8, color: 'white' }}>
              Home
            </div>
          </Link>
          <Link to="/assets">
            <div style={{ margin: 8, color: 'white' }}>
              Assets
          </div>
          </Link>
          <Link to="/yourLoans">
            <div style={{ margin: 8, color: 'white' }}>
              Your Loans
            </div>
          </Link>
          <Link to="/yourBorrows">
            <div style={{ margin: 8, color: 'white' }}>
              Your Borrows
            </div>
          </Link>
        </div>

        <span>
          <button style={{ marginRight: 40 }} disabled={props.disabled} onClick={props.onClick}>
            {props.loginButtonText}
          </button>
          <img className="sandIcon" src={sandIcon} alt="SAND logo" style={{
            height: 30,
            width: 30,
          }} />
          <b style={{
            color: 'white',
            fontSize: "1.3em"
          }}>{props.sandBalance}</b>
        </span>
      </div>
    </div >
  );
};

export default Navbar;
