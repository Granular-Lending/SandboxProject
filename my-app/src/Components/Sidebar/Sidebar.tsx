import React from "react";

import "./Sidebar.css";
import profileImg from "./assets/kenny.jpg";
import sandIcon from "./assets/sandIcon.png";
import { POOL_ADDRESS } from "../../App";

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
          <button style={{ marginRight: 10 }} onClick={() => props.sandTokenInst.methods.approve(POOL_ADDRESS, 1000).send({ from: props.accounts[0] }).then(console.log).catch(console.error)}>Authorize the pool contract to operate {props.sym} on your behalf</button>
          <button onClick={() => props.assetTokenInst.methods.setApprovalForAll(POOL_ADDRESS, true).send({ from: props.accounts[0] }).then(console.log).catch(console.error)}>Authorize the pool contract to operate ASSETS on your behalf</button>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;
