import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { NavLink } from "react-router-dom";
import Blockies from 'react-blockies';
import React, { useState } from "react";

export interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

const collectAssetFail = (inst: any, from: string, index: string) => {
  inst.methods.collectLoanFail(index).send({ from: from }).then(console.log);
};

const YourLoansPage = (props: PopupProps) => {
  const [loanFilter, setLoanFilter] = React.useState('0');

  const generateTable = (loans: Loan[]) => {
    return <TableContainer style={{ backgroundColor: "#1b2030" }} >
      <Table>
        < TableHead >
          <TableRow>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Item</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Borrower</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Cost</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Deposit</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Duration</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Due date</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}></TableCell>
          </TableRow>
        </TableHead >
        <TableBody>
          {loans
            .map((l: Loan) => {
              const asset = props.assets.find(
                (a: Asset) => a.id === l.asset_id
              );
              return (
                <TableRow key={loans.indexOf(l)}>
                  <TableCell style={{ color: "white" }}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 35 }}
                      src={
                        process.env.PUBLIC_URL +
                        `/equipment/${asset ? asset.image : ""}`
                      }
                    />
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {l.borrower ===
                      "0x0000000000000000000000000000000000000000"
                      ? "None"
                      : <Tooltip title={l.borrower}>
                        <div>
                          <Blockies
                            seed={l.loaner}
                            size={10}
                            scale={5}
                            color="#fff"
                            bgColor="#3ce"
                            spotColor="#f0f"
                            className="identicon"
                          />
                        </div>
                      </Tooltip>}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.cost}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.deposit}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {l.duration} seconds
                  </TableCell>
                  <TableCell style={{ color: +(l.startTime * 1000 + l.duration * 1000) < Date.now() && l.state === "1" ? "red" : "white", fontSize: '1rem' }}>
                    {l.state === '0' ? 'N/A' : new Date(+l.startTime * 1000 + +l.duration * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    {l.state === "1" &&
                      Date.now() > l.startTime * 1000 + l.duration * 1000 ? (
                      <Button style={{ width: '100%' }}
                        variant="contained"
                        onClick={() => {
                          setShowTimeout(true);
                          setChosenLoan(l);
                          const assetWithID = props.assets.find(
                            (a: Asset) => a.id === l.asset_id
                          );
                          if (assetWithID) { setChosenAsset(assetWithID); }
                        }
                        }
                      >
                        Timeout
                        <ArrowForwardIosIcon />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table >
    </TableContainer >
  }

  const [chosenAsset, setChosenAsset] = useState(props.assets[0]);
  const [chosenLoan, setChosenLoan] = useState({
    cost: 0,
    deposit: 0,
    duration: 0,
    startTime: 0,
    loaner: "",
    borrower: "",
    asset_id: "",
    state: "",
  });
  const [showTimeout, setShowTimeout] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <Dialog
        open={showTimeout}
        onClose={() => setShowTimeout(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to timeout 1 {chosenAsset.name}.
            <p>
              As they failed to return, this action will give you their <b>{chosenLoan.deposit} SAND</b> deposit.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() =>
              collectAssetFail(
                props.poolInst,
                props.accounts[0],
                props.loans.indexOf(chosenLoan).toString()
              )}
          >
            Accept
              < ArrowForwardIosIcon />
          </Button>
        </DialogActions>
      </Dialog>
      <h2>Your Loans</h2>
      <FormControl>
        <Select style={{ color: 'white' }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={loanFilter}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => setLoanFilter(event.target.value as string)}
        >
          <MenuItem value={'0'}>Listed loans</MenuItem>
          <MenuItem value={'1'}>Active loans</MenuItem>
          <MenuItem value={'2'}>Past loans</MenuItem>
        </Select>
      </FormControl>
      <NavLink style={{ textDecoration: "none" }} to="/createLoan">
        <Button variant="contained">Create a loan</Button>
      </NavLink>
      { generateTable(props.loans.filter(
        (l: Loan) =>
          l.state === loanFilter &&
          l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
      ))}
    </div>
  );
};

export default YourLoansPage;
