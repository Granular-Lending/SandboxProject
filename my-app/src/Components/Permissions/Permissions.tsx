import React from "react";

import "./Permissions.css";
import { Button } from "@material-ui/core";

interface PermissionsProps {
  sandBalance: number;
  accounts: string[];
  sym: string;
  pool_address: string;
  sandTokenInst: any;
  assetTokenInst: any;
  assetsApproved: boolean;
  sandAllowance: boolean;
}

const Permissions = (props: PermissionsProps) => {
  return (
    <div style={{ padding: 10 }} >
      <div className="sidebar-container">
        <h2>Permissions</h2>
        <p>To create or take out a loan, we need approval to transfer both FAU tokens and ASSETS on your behalf.</p>

        <p>The pool contract can be found at <a href={`https://ropsten.etherscan.io/address/${props.pool_address}`} target="_blank" rel="noreferrer">{props.pool_address}</a></p>
        <div>
          <div>
            <h3>For loaning and borrowing</h3>
            <h4>{props.sym}</h4>
            Authorize the pool contract to operate {props.sym} on your behalf
            <Button
              disabled={props.sandAllowance}
              variant="contained"
              style={{ marginLeft: 20 }}
              onClick={() =>
                props.sandTokenInst.methods
                  .approve(props.pool_address, 100000)
                  .send({ from: props.accounts[0] })
                  .then(console.log)
                  .catch(console.error)
              }
            >
              {props.sandAllowance ? "already approved" : "approve"}
            </Button>
            <h4>ASSETS</h4>
            Authorize the pool contract to operate ASSETS on your behalf
            <Button
              disabled={props.assetsApproved}
              variant="contained"
              style={{ marginLeft: 20 }}
              onClick={() =>
                props.assetTokenInst.methods
                  .setApprovalForAll(props.pool_address, true)
                  .send({ from: props.accounts[0] })
                  .then(console.log)
                  .catch(console.error)
              }
            >
              {props.assetsApproved ? "already approved" : "approve"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
