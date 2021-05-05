import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, InputLabel, Select, FormControl } from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export interface PopupProps {
  a: Asset;
  poolInst: any;
  accounts: string[];
  sales: Loan[];
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptLoan(index).send({ from: from }).then(console.log);
}

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
}

const collectAsset = (inst: any, from: string, index: string) => {
  inst.methods.collectLoan(index).send({ from: from }).then(console.log);
}

const collectAssetFail = (inst: any, from: string, index: string) => {
  inst.methods.collectLoanFail(index).send({ from: from }).then(console.log);
}

const mappings: Record<number, string> = {
  0: "Listed",
  1: "Borrowed",
  2: "Returned",
  3: "Collected",
};

const Loans = (props: PopupProps) => {
  const [filter, setFilter] = React.useState(0);

  const buttonMapping: Record<number, any> = {
    0: (l: Loan) => filter === 0 ? <Button variant="contained" onClick={() => buyAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>{'Loan item'}</Button> : null,
    1: (l: Loan) =>
      <div>
        {filter === 1 ? <Button variant="contained" onClick={() => collectAssetFail(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Time out</Button> : null}
        {filter === 2 ? <Button variant="contained" onClick={() => returnAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Return item</Button > : null}
      </div>,
    2: (l: Loan) => filter === 1 ? <Button variant="contained" onClick={() => collectAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Collect item from pool</Button > : null,
    3: (l: Loan) => null
  }

  const handleChangeAlp = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(event.target.value as number);
  };

  const AssetCard = (a: Asset) => {
    return <div>
      <Button variant='contained' color='primary' style={{ margin: 8, fontSize: '1em' }}>
        <ArrowBackIcon></ArrowBackIcon>
        <Link to="/assets">Back</Link>
      </Button>
      <div style={{ display: 'flex' }}>
        <img
          alt="missing metadata"
          style={{ objectFit: "contain", width: 250 }}
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div>
          <h1>
            {a.name}
          </h1>
          <h3>{a.description}</h3>
          <h4>Type: {a.classification.type}</h4>
          <h4>Theme: {a.classification.theme}</h4>
          <h4>Categories: {a.classification.categories.join(", ")}</h4>
        </div>
      </div>
    </div >
  };

  return <div>
    {AssetCard(props.a)}
    < h2 > Loans</h2>
    <div style={{ display: 'flex' }}>
      <FormControl >
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          onChange={handleChangeAlp}
        >
          <MenuItem value={0}>All loans</MenuItem>
          <MenuItem value={1}>Loans where you are the loaner</MenuItem>
          <MenuItem value={2}>Loans where you are the loanee</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained' color='primary'>
        <Link to="/createLoan">Create a loan</Link>
      </Button>
    </div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Deposit</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Loaner</TableCell>
            <TableCell>Loanee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.sales.map((l: Loan) => (l.asset_id === props.a.id && ((filter === 0) || (filter === 1 && l.loaner.toLowerCase() === props.accounts[0].toLowerCase()) || (filter === 2 && l.loanee.toLowerCase() === props.accounts[0].toLowerCase())) ?
            <TableRow key={l.cost} >
              <TableCell >
                <img
                  alt="missing metadata"
                  style={{ objectFit: "contain", width: 20 }}
                  src={process.env.PUBLIC_URL + `/equipment/${props.a.image}`}
                />
              </TableCell>
              <TableCell>
                <span>
                  <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                </span>
                {l.cost}
              </TableCell>
              <TableCell >
                <span>
                  <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                </span>
                {l.deposit}
              </TableCell>
              <TableCell>{l.duration}</TableCell>
              <TableCell>{l.loaner.slice(0, 12)}...</TableCell>
              <TableCell>{l.loanee.slice(0, 12)}...</TableCell>
              <TableCell>{mappings[l.state]}</TableCell>
              <TableCell>
                {buttonMapping[l.state](l)}
              </TableCell>
            </TableRow> : null
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div >
};

export default Loans;
