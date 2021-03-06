import React from "react";

import "./Permissions.css";
import { Button, Grid } from "@material-ui/core";

interface PermissionsProps {
  assetsApproved: boolean;
  sandApproved: boolean;
  accounts: string[];
  sym: string;
  sandTokenInst: any;
  assetTokenInst: any;
  poolInst: any;
}

const Permissions = (props: PermissionsProps) => {
  return (
    <div style={{ padding: 10 }} >
      <div className="sidebar-container">
        <h2>Permissions</h2>
        <p>To create or take out a loan, we need approval to transfer both FAU tokens and ASSETS on your behalf.</p>
        <p>The pool contract can be found at <a href={`https://ropsten.etherscan.io/address/${props.poolInst.options.address}`} target="_blank" rel="noreferrer">{props.poolInst.options.address}</a></p>
        <div>
          <div>
            <h3>For loaning and borrowing</h3>
            <Grid container direction="column">
              <Grid container style={{ padding: 10, paddingLeft: 0 }}>
                <Grid item xs>
                  Authorize the pool contract to operate <b>{props.sym}</b> on your behalf
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={props.sandApproved}
                    variant="contained"
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      props.sandTokenInst.methods
                        .approve(props.poolInst.options.address, 100000000)
                        .send({ from: props.accounts[0] })
                    }
                  >
                    {props.sandApproved ? "already approved" : "approve"}
                  </Button>
                </Grid>
              </Grid>
              <Grid container style={{ padding: 10, paddingLeft: 0 }}>
                <Grid item xs>
                  Authorize the pool contract to operate <b>ASSETS</b> on your behalf
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={props.assetsApproved}
                    variant="contained"
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      props.assetTokenInst.methods
                        .setApprovalForAll(props.poolInst.options.address, true)
                        .send({ from: props.accounts[0] })
                    }
                  >
                    {props.assetsApproved ? "already approved" : "approve"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
