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
  Grid,
  Link,
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
import CachedIcon from '@material-ui/icons/Cached';
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

const collectAsset = (inst: any, from: string, index: string) => {
  inst.methods.collectLoan(index).send({ from: from }).then(console.log);
};

const collectTimeout = (inst: any, from: string, index: string) => {
  inst.methods.timeoutLoan(index).send({ from: from }).then(console.log);
};

export const anotherMap: Record<string, string> = {
  'create': 'CREATION',
  'accept': 'ACCEPTANCE',
  'collect': 'COLLECTION',
  'timeout': 'TIMEOUT',
  'return': 'RETURN'
}

const YourLoansPage = (props: PopupProps) => {
  const [loanFilter, setLoanFilter] = React.useState('0');

  const generateTable = (loans: Loan[]) => {
    return <TableContainer style={{ backgroundColor: "#1b2030" }} >
      <Table>
        < TableHead >
          <TableRow>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Item</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Borrower</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Cost per second</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Deposit</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Duration</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.2rem' }}>Available until</TableCell>
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
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    <Tooltip title={asset ? asset.name : ""}>
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
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    {l.state === "1"
                      ? <Tooltip title={l.borrower}>
                        <div>
                          <Blockies
                            seed={l.borrower}
                            size={10}
                            scale={5}
                            color={`#${l.borrower.slice(2, 5)}`}
                            bgColor={`#${l.borrower.slice(2 + 3, 5 + 3)}`}
                            spotColor={`#${l.borrower.slice(2 + 6, 5 + 6)}`}
                            className="identicon"
                          />
                        </div>
                      </Tooltip>
                      : "None"}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.cost}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.deposit}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    {l.duration} seconds
                  </TableCell>
                  <TableCell style={{ color: l.tx === '' && (Date.now() > l.entry * 1000 + l.duration * 1000 && (l.state === "0" || l.state === "1")) ? "red" : "white", fontSize: '1rem' }}>
                    {l.tx !== '' ? (
                      <div>PENDING {anotherMap[l.pendingFunction]}</div>
                    ) : new Date(l.entry * 1000 + l.duration * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: "1rem" }}>
                    {l.state === "0" && l.tx === '' ? (
                      <Button style={{ width: '100%' }}
                        variant="contained"
                        onClick={() => {
                          setShowCollect(true);
                          setChosenLoan(l);
                          const assetWithID = props.assets.find(
                            (a: Asset) => a.id === l.asset_id
                          );
                          if (assetWithID) { setChosenAsset(assetWithID); }
                        }
                        }
                      >
                        Collect ASSET
                        <ArrowForwardIosIcon />
                      </Button>
                    ) :
                      l.tx !== '' ? (
                        <Link style={{ fontSize: "1rem" }} rel="noopener" target="_blank" href={`https://ropsten.etherscan.io/tx/${l.tx}`}><LaunchIcon />View on Etherscan</Link>
                      ) : null
                    }
                    {l.state === "1" &&
                      Date.now() > l.entry * 1000 + l.duration * 1000 && l.tx === '' ? (
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
    entry: 0,
    startTime: 0,
    loaner: "",
    borrower: "",
    asset_id: "",
    state: "",
    tx: '',
    pendingFunction: ''
  });
  const [showCollect, setShowCollect] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  const [loanTable, setLoanTable] = useState(generateTable(props.loans.filter(
    (l: Loan) =>
      l.state === loanFilter &&
      l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
  )));

  React.useEffect(() => {
    setLoanTable(generateTable(props.loans.filter(
      (l: Loan) =>
        l.state === loanFilter &&
        l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
    )));
    // eslint-disable-next-line
  }, [props.loans]); // run this function when loans filled


  return (
    <div style={{ padding: 40 }}>
      <Dialog
        open={showTimeout}
        onClose={() => setShowTimeout(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{chosenAsset.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            As the borrower has failed to return this ASSET, this action will give you their <b>{chosenLoan.deposit} SAND</b> deposit.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() =>
              collectTimeout(
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
      <Dialog
        open={showCollect}
        onClose={() => setShowCollect(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{chosenAsset.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to collect this asset and take it out of the pool.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              collectAsset(
                props.poolInst,
                props.accounts[0],
                props.loans.indexOf(chosenLoan).toString()
              )
            }}
          >
            Accept
              < ArrowForwardIosIcon />
          </Button>
        </DialogActions>
      </Dialog>
      <h2>Your Loans</h2>
      <Grid container>
        <Grid item xs>
          <FormControl>
            <Select style={{ color: 'white' }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={loanFilter}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setLoanFilter(event.target.value as string);
                setLoanTable(generateTable(props.loans.filter(
                  (l: Loan) =>
                    l.state === event.target.value as string &&
                    l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
                )));
              }}
            >
              <MenuItem value={'0'}>Listed loans</MenuItem>
              <MenuItem value={'1'}>Active loans</MenuItem>
            </Select>
          </FormControl>
          <Button style={{ marginLeft: 40 }} variant='contained' onClick={() => {
            props.addPendingLoans(props.poolInst, props.accounts[0]);
            setLoanTable(generateTable(props.loans.filter(
              (l: Loan) =>
                l.state === loanFilter &&
                l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
            )));
          }}><CachedIcon /></Button>
        </Grid>
        <Grid item xs>
          <NavLink style={{ textDecoration: "none" }} to="/createLoan">
            <Button style={{ marginLeft: 40 }} variant="contained">Create new loan</Button>
          </NavLink>
        </Grid>
      </Grid>
      {loanTable}

    </div>
  );
};

export default YourLoansPage;
