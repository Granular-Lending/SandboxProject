import React from "react";

import "./Permissions.css";
import { Button, Grid, TextField } from "@material-ui/core";
import { ERC20, Verse } from "../../App";
import sandIcon from "./assets/sandIcon.png";

interface PermissionsProps {
  accounts: string[];
  sandToken: ERC20;
  verses: Verse[];
  poolInst: any;
}

const Permissions = (props: PermissionsProps) => {
  const [newAllowance, setNewAllowance] = React.useState(5);

  return (
    <div style={{ padding: 10 }} >
      <div className="sidebar-container">
        <h2>Permissions</h2>
        <p>To create or take out a loan, we need approval to transfer both FAU tokens and NFT'S on your behalf.</p>
        <p>The pool contract can be found at <a href={`https://ropsten.etherscan.io/address/${props.poolInst.options.address}`} target="_blank" rel="noreferrer">{props.poolInst.options.address}</a></p>
        <div>
          <div>
            <h3>Token</h3>
            <Grid container direction="column">
              <Grid container style={{ padding: 10, paddingLeft: 0 }}>
                <Grid item xs>
                  You have {props.sandToken.allowance} allowed <b>{props.sandToken.symbol}</b>
                </Grid>
                <Grid item xs style={{ backgroundColor: 'white', padding: 20 }}>
                  <img style={{ objectFit: "contain", width: 30 }} src={sandIcon} alt="SAND logo" />
                  <TextField
                    label="New allowance"
                    onChange={(e: any) => setNewAllowance(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      props.sandToken.contractInst.methods
                        .approve(props.poolInst.options.address, newAllowance)
                        .send({ from: props.accounts[0] })
                    }
                  >
                    Update allowance
                  </Button>
                </Grid>
              </Grid>
              <h3>NFT's</h3>
              {props.verses.map((v: Verse) => <Grid container style={{ padding: 10, paddingLeft: 0 }}>
                <Grid item xs>
                  Authorize the pool contract to operate <b>{v.name}</b> on your behalf
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={v.approved}
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: 20 }}
                    onClick={() =>
                      v.contractInst.methods
                        .setApprovalForAll(props.poolInst.options.address, true)
                        .send({ from: props.accounts[0] })
                    }
                  >
                    {v.approved ? "already approved" : "approve"}
                  </Button>
                </Grid>
              </Grid>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
