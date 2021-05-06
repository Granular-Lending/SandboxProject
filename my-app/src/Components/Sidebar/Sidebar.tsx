import React from "react";

import "./Sidebar.css";
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
        <h2>Permissions</h2>
        <div>
          <div>
            <h3>For loaning and borrowing</h3>
            <h4>{props.sym}</h4>
            <button onClick={() => props.sandTokenInst.methods.approve(POOL_ADDRESS, 1000).send({ from: props.accounts[0] }).then(console.log).catch(console.error)}>Authorize the pool contract to operate {props.sym} on your behalf</button>
            <h4>ASSETS</h4>
            <button onClick={() => props.assetTokenInst.methods.setApprovalForAll(POOL_ADDRESS, true).send({ from: props.accounts[0] }).then(console.log).catch(console.error)}>Authorize the pool contract to operate ASSETS on your behalf</button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;
