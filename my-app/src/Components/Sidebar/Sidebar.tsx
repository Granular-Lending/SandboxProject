import React from "react";

import "./Sidebar.css";
import { POOL_ADDRESS } from "../../App";
import { Button } from "@material-ui/core";

interface SidebarProps {
  landBalance: number;
  sandBalance: number;
  accounts: string[];
  sym: string;
  sandTokenInst: any;
  assetTokenInst: any;
}

const Sidebar = (props: SidebarProps) => {
  return (
    <div style={{ padding: 10 }} className="Sidebar">
      <div className="sidebar-container">
        <h2>Permissions</h2>
        <div>
          <div>
            <h3>For loaning and borrowing</h3>
            <h4>{props.sym}</h4>
            Authorize the pool contract to operate {props.sym} on your behalf
            <Button
              variant="contained"
              style={{ marginLeft: 20 }}
              onClick={() =>
                props.sandTokenInst.methods
                  .approve(POOL_ADDRESS, 100000)
                  .send({ from: props.accounts[0] })
                  .then(console.log)
                  .catch(console.error)
              }
            >
              Approve
            </Button>
            <h4>ASSETS</h4>
            Authorize the pool contract to operate ASSETS on your behalf
            <Button
              variant="contained"
              style={{ marginLeft: 20 }}
              onClick={() =>
                props.assetTokenInst.methods
                  .setApprovalForAll(POOL_ADDRESS, true)
                  .send({ from: props.accounts[0] })
                  .then(console.log)
                  .catch(console.error)
              }
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
