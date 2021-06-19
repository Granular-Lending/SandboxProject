import { NFT, Loan, Verse } from "../../App";
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
import CachedIcon from '@material-ui/icons/Cached';
import { anotherMap } from "./YourLoansPage";
import LaunchIcon from '@material-ui/icons/Launch';
import { formatSand } from "./Marketplace";
import { DeNationsCard } from "./AssetPage";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assets: NFT[];
  addPendingLoans: any;
}

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
};

const YourBorrowsPage = (props: PopupProps) => {
  const [chosenAsset, setChosenAsset] = React.useState({ id: '-1', verseObj: new Verse("", [], async (s: string) => 2, "", DeNationsCard, null, false), balance: -1, metadata: { name: '', image: '' } });
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
              (a: NFT) => a.id === l.asset_id
            );
            return (
              <TableRow key={loans.indexOf(l)}>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  <Tooltip title={asset ? asset.metadata.name : 'nada'}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 35 }}
                      src={asset ? asset.metadata.image : ''}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  <Tooltip title={l.loaner}>
                    <div>
                      <Jazzicon diameter={30} seed={jsNumberForAddress(l.loaner)} />
                    </div>
                  </Tooltip></TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  {formatSand(l.cost)}
                </TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  {formatSand(l.deposit)}
                </TableCell>
                <TableCell style={{ color: "white", fontSize: '1rem' }}>
                  {new Date(l.startTime * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ color: l.entry * 1000 + l.duration * 1000 < Date.now() && l.state === "1" ? "red" : "white", fontSize: '1rem' }}>
                  {l.tx === '' ? new Date(l.entry * 1000 + l.duration * 1000).toLocaleString() : `PENDING ${anotherMap[l.pendingFunction]}`}
                </TableCell>
                <TableCell style={{ color: "white" }}>
                  {l.state === "1" && l.tx === '' ? (
                    <Button
                      style={{ width: '100%' }}
                      variant="contained"
                      onClick={() => {
                        setChosenLoan(l);
                        setShowD(true);
                        if (asset) { setChosenAsset(asset); }
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
    </TableContainer >
  }

  const [loanTable, setLoanTable] = useState(<div></div >);

  React.useEffect(() => {
    setLoanTable(generateTable(props.loans.filter(
      (l: Loan) =>
        l.borrower.toLowerCase() === props.accounts[0].toLowerCase() &&
        (l.state === "1" || l.tx !== '')
    )));
    // eslint-disable-next-line
  }, [props.loans]); // run this function when loans filled

  const fee = chosenLoan.cost * Math.floor((Date.now() - chosenLoan.startTime * 1000) / 1000);
  const secondsHeld = Math.floor((Date.now() / 1000 - chosenLoan.startTime));

  return (
    <div style={{ padding: 40 }}>
      <Dialog
        open={showD}
        onClose={() => setShowD(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{chosenAsset.metadata.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {+chosenLoan.entry * 1000 + +chosenLoan.duration * 1000 < Date.now() ? <div style={{ border: 'solid', padding: 5, marginBottom: 10, color: 'red' }}>
              <div style={{ color: 'red' }}>
                This asset is overdue! Return it soon or risk forfeiting your deposit.
              </div>
            </div> : null}
            <p>
              You held this ASSET for {secondsHeld} seconds at a cost of {chosenLoan.cost} SAND per second.
              </p>
            <Grid container >
              <Grid container spacing={2} >
                <Grid item xs><i>Cost per second</i><p>{chosenLoan.cost}</p></Grid>
                <Grid item ><b>*</b></Grid>
                <Grid item xs><i>Seconds held</i><p>{secondsHeld}</p></Grid>
                <Grid item ><b>=</b></Grid>
                <Grid item xs><i><b>Fee</b></i>
                  <p>
                    {formatSand(fee)}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ borderStyle: 'solid' }} >
                <Grid item xs><b>Deposit</b>
                  <p>{formatSand(chosenLoan.deposit)}</p>
                </Grid>
                <Grid item ><b>-</b></Grid>
                <Grid item xs><b>Fee</b>
                  <p>
                    {formatSand(fee)}
                  </p></Grid>
                <Grid item ><b>=</b></Grid>
                <Grid item xs ><b>Total</b>
                  <p>{formatSand(chosenLoan.deposit - fee)}</p></Grid>
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
      </Dialog >
      <h2>Your Borrows</h2>
      <Button variant='contained' onClick={() => {
        props.addPendingLoans(props.poolInst, props.accounts[0]);
      }}>
        <CachedIcon />
      </Button>
      {loanTable}
    </div >
  );
};

export default YourBorrowsPage;
