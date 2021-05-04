import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { PopupProps } from "./SalesPopup";
import React from "react";

const transferAsset = (inst: any, from: string, asset_id: string, cost: number, deposit: number) => {
  inst.methods.createSale(asset_id, cost, deposit).send({ from: from }).then(console.log);
}

const CreatePopup = (props: PopupProps) => {
  const [cost, setCost] = React.useState(5);
  const [deposit, setDeposit] = React.useState(5);

  return <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Create a loan</DialogTitle>
    <DialogContent>
      Loaning 1 {props.a.name} for:
      <div style={{ display: 'flex' }}>
        <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
        <TextField
          autoFocus
          margin="dense"
          label="Cost"
          fullWidth
          onChange={(e: any) => setCost(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
        <TextField
          autoFocus
          margin="dense"
          label="Deposit"
          fullWidth
          onChange={(e: any) => setDeposit(e.target.value)}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleClose} color="primary">
        Cancel
    </Button>
      <Button onClick={() => {
        transferAsset(props.poolInst, props.accounts[0], props.a.id, cost, deposit);
        props.handleClose();
      }} color="primary">
        Create
    </Button>
    </DialogActions>
  </Dialog>;
}
export default CreatePopup;
