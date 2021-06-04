import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useState } from "react";
import Blockies from 'react-blockies';


export interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
};

export const mappings: Record<string, string> = {
  "0": "Listed",
  "1": "Borrowed",
  "2": "Returned",
  "3": "Collected",
};

const YourBorrowsPage = (props: PopupProps) => {
  const currentLoans = props.loans.filter(
    (l: Loan) =>
      l.state === "1" &&
      l.borrower.toLowerCase() === props.accounts[0].toLowerCase()
  );
  const completeLoans = props.loans.filter(
    (l: Loan) =>
      (l.state === "2" || l.state === "3") &&
      l.borrower.toLowerCase() === props.accounts[0].toLowerCase()
  );

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
  const [showD, setShowD] = useState(false);
  const [showCurrentLoans, setShowCurrentLoans] = useState(1);

  const generateTable = (loans: Loan[]) => {
    return <TableContainer style={{ backgroundColor: "#1b2030" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Item</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Loaner</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Cost</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Deposit</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Duration</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Start date</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Due date</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((l: Loan) => {
            const asset = props.assets.find(
              (a: Asset) => a.id === l.asset_id
            );
            return (
              <TableRow key={loans.indexOf(l)}>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  <Tooltip title={asset ? asset.name : 'nada'}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 35 }}
                      src={
                        process.env.PUBLIC_URL +
                        `/equipment/${asset ? asset.image : ""}`
                      }
                    />
                  </Tooltip>
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  <Tooltip title={l.loaner}>
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
                  </Tooltip></TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  <span>
                    <img
                      style={{ width: 15 }}
                      src={sandIcon}
                      alt="SAND logo"
                    />
                  </span>
                  {l.cost}
                </TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  <span>
                    <img
                      style={{ width: 15 }}
                      src={sandIcon}
                      alt="SAND logo"
                    />
                  </span>
                  {l.deposit}
                </TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>{l.duration} seconds</TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  {new Date(l.startTime * 1000).toLocaleString()}
                </TableCell>
                <TableCell style={{ color: +(l.startTime * 1000 + l.duration * 1000) < Date.now() && l.state === "1" ? "red" : "white", fontSize: '1rem' }}>
                  {new Date(+l.startTime * 1000 + +l.duration * 1000).toLocaleString()}
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  {l.state === "1" ? (
                    <Button
                      style={{ width: '100%' }}
                      variant="contained"
                      onClick={() => {
                        setChosenLoan(l);
                        setShowD(true);
                        const assetWithID = props.assets.find(
                          (a: Asset) => a.id === l.asset_id
                        );
                        if (assetWithID) { setChosenAsset(assetWithID); }
                      }
                      }
                    >
                      Return item
                      <ArrowForwardIosIcon />
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  }
  return (
    <div style={{ padding: 40 }}>
      <Dialog
        open={showD}
        onClose={() => setShowD(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to return 1 {chosenAsset.name}.
            <p>
              Following the terms of the loan, this action will refund your <b>{chosenLoan.deposit} SAND</b> deposit.
            </p>
            {+chosenLoan.startTime * 1000 + +chosenLoan.duration * 1000 > Date.now() ? <p style={{ color: 'black' }}>
              This asset is due on {new Date(+Date.now() + +chosenLoan.duration * 1000).toLocaleDateString()} at {new Date(+Date.now() + +chosenLoan.duration * 1000).toLocaleTimeString()}. You still have {((+chosenLoan.startTime + +chosenLoan.duration) - +(Math.round(Date.now() / 1000)))} seconds of use.
            </p> : <p style={{ color: 'red' }}>
              This loan is overdue! Return the asset soon or risk forfeiting your deposit.
            </p>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() =>
              returnAsset(
                props.poolInst,
                props.accounts[0],
                props.loans.indexOf(chosenLoan).toString()
              )}
          >
            Accept
        <ArrowForwardIosIcon />
          </Button>
        </DialogActions>
      </Dialog>
      <h2>Your Borrows</h2>
      <FormControl>
        <Select style={{ color: 'white' }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={showCurrentLoans}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => setShowCurrentLoans(event.target.value as number)}
        >
          <MenuItem value={1}>Active loans</MenuItem>
          <MenuItem value={0}>Past loans</MenuItem>
        </Select>
      </FormControl>
      {showCurrentLoans ? generateTable(currentLoans) : generateTable(completeLoans)}
    </div>
  );
};

export default YourBorrowsPage;
