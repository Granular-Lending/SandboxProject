import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, TextField } from "@material-ui/core";
import { PopupProps } from "./AssetPage";
import React from "react";
import {
  Link
} from "react-router-dom";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const transferAsset = (inst: any, from: string, asset_id: string, cost: number, deposit: number, duration: number) => {
  inst.methods.createLoan(asset_id, cost, deposit, duration).send({ from: from }).then(console.log);
}

const CreatePopup = (props: PopupProps) => {
  const [cost, setCost] = React.useState(5);
  const [deposit, setDeposit] = React.useState(5);
  const [duration, setDuration] = React.useState(5);

  return <div>
    <Link to="/asset">
      <Button variant='contained' style={{ margin: 8, fontSize: '1em' }}>
        <ArrowBackIosIcon />
        Back
      </Button>
    </Link>
  Loaning 1 {props.a.name} for:
    <div style={{ backgroundColor: 'white' }}>
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
          margin="dense"
          label="Deposit"
          fullWidth
          onChange={(e: any) => setDeposit(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <TextField
          margin="dense"
          label="Duration (seconds)"
          fullWidth
          onChange={(e: any) => setDuration(e.target.value)}
        />
      </div>
      <Button onClick={() => transferAsset(props.poolInst, props.accounts[0], props.a.id, cost, deposit, duration)}>Submit</Button>
    </div ></div >
}
export default CreatePopup;
