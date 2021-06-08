import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button,
  Grid,
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
  Link,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useState } from "react";
import Blockies from 'react-blockies';
import CachedIcon from '@material-ui/icons/Cached';
import { anotherMap } from "./YourLoansPage";
import LaunchIcon from '@material-ui/icons/Launch';

export interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
  addPendingLoans: any;
}

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
};

const YourBorrowsPage = (props: PopupProps) => {
  const [chosenAsset, setChosenAsset] = useState(props.assets[0]);
  const [chosenLoan, setChosenLoan] = useState({
    cost: 0,
    deposit: 0,
    duration: 0,
    entry: 0,
    startTime: 0,
    loaner: "",
    borrower: "",
    asset_id: "",
    state: "",
    tx: '',
    pendingFunction: ''
  });
  const [showD, setShowD] = useState(false);

  const generateTable = (loans: Loan[]) => {
    return <TableContainer style={{ backgroundColor: "#1b2030" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Item</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Loaner</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Cost per second</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Deposit</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Loan started on</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Available until</TableCell>
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
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  {new Date(l.startTime * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ color: l.entry * 1000 + l.duration * 1000 < Date.now() && l.state === "1" ? "red" : "white", fontSize: '1rem' }}>
                  {l.tx === '' ? new Date(+l.entry * 1000 + +l.duration * 1000).toLocaleString() : `PENDING ${anotherMap[l.pendingFunction]}`}
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  {l.state === "1" && l.tx === '' ? (
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
                  ) :
                    l.tx !== '' ? (
                      <Link style={{ fontSize: "1rem" }} rel="noopener" target="_blank" href={`https://ropsten.etherscan.io/tx/${l.tx}`}><LaunchIcon />View on Etherscan</Link>
                    ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  }

  const [loanTable, setLoanTable] = useState(generateTable(props.loans.filter(
    (l: Loan) =>
      l.state === "1" &&
      l.borrower.toLowerCase() === props.accounts[0].toLowerCase()
  )));

  React.useEffect(() => {
    setLoanTable(generateTable(props.loans.filter(
      (l: Loan) =>
        l.borrower.toLowerCase() === props.accounts[0].toLowerCase() &&
        (l.state === "1" || l.tx !== '')
    )));
    // eslint-disable-next-line
  }, [props.loans]); // run this function when loans filled

  return (
    <div style={{ padding: 40 }}>
      <Dialog
        open={showD}
        onClose={() => setShowD(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{chosenAsset.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {+chosenLoan.entry * 1000 + +chosenLoan.duration * 1000 < Date.now() ? <div style={{ border: 'solid', padding: 5, marginBottom: 10, color: 'red' }}>
              <div style={{ color: 'red' }}>
                This asset is overdue! Return it soon or risk forfeiting your deposit.
              </div>
            </div> : null}
            <p>
              You held this ASSET for {Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000)} seconds at a cost of {chosenLoan.cost} SAND per second.
              </p>
            <Grid container >
              <Grid container spacing={2} >
                <Grid item xs><i>Cost per second</i><p>{chosenLoan.cost}</p></Grid>
                <Grid item ><b>*</b></Grid>
                <Grid item xs><i>Seconds held</i><p>{Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000)}</p></Grid>
                <Grid item ><b>=</b></Grid>
                <Grid item xs><i><b>Fee</b></i>
                  <p>
                    <span>
                      <img
                        style={{ width: 18 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {chosenLoan.cost * Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000)}</p></Grid>
              </Grid>
              <Grid container spacing={2} style={{ borderStyle: 'solid' }} >
                <Grid item xs><b>Deposit</b><p>{chosenLoan.deposit}</p></Grid>
                <Grid item ><b>-</b></Grid>
                <Grid item xs><b>Fee</b><p><span>
                  <img
                    style={{ width: 18 }}
                    src={sandIcon}
                    alt="SAND logo"
                  />
                </span>{chosenLoan.cost * Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000)}</p></Grid>
                <Grid item ><b>=</b></Grid>
                <Grid item xs ><b>Total</b><p><span>
                  <img
                    style={{ width: 18 }}
                    src={sandIcon}
                    alt="SAND logo"
                  />
                </span>{chosenLoan.deposit - chosenLoan.cost * Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000)}</p></Grid>
              </Grid>
            </Grid>
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
            Return asset and pay fee
        <ArrowForwardIosIcon />
          </Button>
        </DialogActions>
      </Dialog>
      <h2>Your Borrows</h2>
      <Button variant='contained' onClick={() => {
        props.addPendingLoans(props.poolInst, props.accounts[0]);
      }}><CachedIcon /></Button>
      { loanTable}
    </div >
  );
};

export default YourBorrowsPage;
