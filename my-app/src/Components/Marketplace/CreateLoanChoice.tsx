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
  assetBalances: Record<string, number>;
  assets: Asset[];
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
    <h2 style={{ paddingLeft: 40 }}>Create a new loan</h2>
    <div style={{ backgroundColor: 'white', padding: 10 }}>
      <h4 style={{ color: 'black' }}>ASSET</h4>
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assetID}
          onChange={handleChange}
          style={{ padding: 10, marginLeft: 20, marginRight: 20 }}>
          {props.assets.filter((a: Asset) => props.assetBalances[a.id] > 0).map((a: Asset) =>
            <MenuItem value={a.id}>
              {a.name}
              <img
                alt="missing metadata"
                style={{ objectFit: "contain", height: 25, paddingLeft: 10 }}
                src={a.image}
              />
            </MenuItem>)}
        </Select>
      </FormControl>
      <h4 style={{ color: 'black' }}>Terms</h4>
      <div style={{
        display: 'flex'
      }}>

        <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
        <TextField
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
    <Button style={{ margin: 10 }} variant='contained' onClick={() => {
      props.poolInst.methods.createLoan(assetID, cost, deposit, duration).send({ from: props.accounts[0] }).then();
    }}>Submit</Button>
  </div >
}
export default CreateLoanChoice;
