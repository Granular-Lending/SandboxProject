import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, TextField, FormControl, Select, MenuItem } from "@material-ui/core";
import React from "react";
import {
  Link
} from "react-router-dom";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Asset } from "../../App";

interface ChoiceProps {
  poolInst: any;
  accounts: string[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

const transferAsset = (inst: any, from: string, asset_id: string, cost: number, deposit: number, duration: number) => {
  inst.methods.createLoan(asset_id, cost, deposit, duration).send({ from: from }).then(console.log);
}

const CreateLoanChoice = (props: ChoiceProps) => {
  const [cost, setCost] = React.useState(5);
  const [deposit, setDeposit] = React.useState(5);
  const [duration, setDuration] = React.useState(5);
  const [assetID, setAssetID] = React.useState(props.assets[0].id);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAssetID(event.target.value as string);
  };

  return <div>
    <Link to="/yourLoans">
      <Button variant='contained' style={{ margin: 8, fontSize: '1em' }}>
        <ArrowBackIosIcon />
        Back
      </Button>
    </Link>
  Loaning 1
  <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={assetID}
        onChange={handleChange}
        style={{ padding: 10, marginLeft: 20, marginRight: 20, color: 'white' }}>
        {props.assets.filter((a: Asset) => props.assetBalances[props.tokenids.indexOf(a.id)] > 0).map((a: Asset) => <MenuItem value={a.id}>
          <img
            alt="missing metadata"
            style={{ objectFit: "contain", height: 25 }}
            src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
          />{a.name}</MenuItem>)}
      </Select>
    </FormControl> for:
    <div style={{ backgroundColor: 'white' }}>
      <div style={{
        display: 'flex'
      }}>
        <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
        <TextField
          autoFocus
          margin="dense"
          label="Cost per second"
          fullWidth
          onChange={(e: any) => setCost(e.target.value)}
          style={{ color: 'white' }}
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
    </div >
    <Button style={{ margin: 10 }} variant='contained' onClick={() => transferAsset(props.poolInst, props.accounts[0], assetID, cost, deposit, duration)}>Submit</Button>
  </div >
}
export default CreateLoanChoice;
