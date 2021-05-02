import React from "react";

import "./Sidebar.css";
import profileImg from "./assets/kenny.jpg";
import sandIcon from "./assets/sandIcon.png";

interface SiderbarProps {
  landBalance: number,
  sandBalance: number,
  accounts: string[],
  sym: string,
  sandTokenInst: any,
  assetTokenInst: any
}

const Sidebar = (props: SiderbarProps) => {
  return (
    <div className="Sidebar">
      <div className="sidebar-container">
        <h2>Your Account</h2>
        <div>
          <img className="profileImg" src={profileImg} alt="user's profile" />
          <h3>
            Your address <b>{props.accounts}</b>
          </h3>
          <div className="accBalance">
            <h3>
              Your {props.sym} balance :{" "}
              <span>
                <img className="sandIcon" src={sandIcon} alt="SAND logo" />
              </span>{" "}
              <b>{props.sandBalance}</b>
            </h3>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;
