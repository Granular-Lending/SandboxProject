import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button, Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell, DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React from "react";
import Blockies from 'react-blockies';

export interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

interface AssetProps {
  asset: Asset, balance: number
}

interface ParamTypes {
  id: string
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptLoan(index).send({ from: from }).then(console.log);
};

const AssetCard = (props: AssetProps) => {
  return (
    <div>
      <Link style={{ textDecoration: "none" }} to="/assets">
        <Button variant="contained" style={{ margin: 8, fontSize: "1em" }}>
          <ArrowBackIosIcon />
          Back
        </Button>
      </Link>
      <div style={{ display: "flex" }}>
        <img
          alt="missing metadata"
          style={{ objectFit: "contain", width: 250, padding: 20 }}
          src={process.env.PUBLIC_URL + `/equipment/${props.asset.image}`}
        />
        <div style={{ width: "100%" }}>
          <h1>{props.asset.name}</h1>
          <h3>You own {props.balance}</h3>
          <div
            style={{
              padding: 8,
              borderStyle: "solid",
              backgroundColor: "#1b2040",
            }}
          >
            <h3>{props.asset.description}</h3>
            <h4>Type: {props.asset.classification.type}</h4>
            <h4>Theme: {props.asset.classification.theme}</h4>
            <h4>Categories: {props.asset.classification.categories.join(", ")}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetPage = (props: PopupProps) => {
  let { id } = useParams<ParamTypes>();

  const [chosenAsset, setChosenAsset] = React.useState(props.assets[0]);
  const [chosenLoan, setChosenLoan] = React.useState({
    cost: 0,
    deposit: 0,
    duration: 0,
    startTime: 0,
    loaner: "",
    borrower: "",
    asset_id: "",
    state: "",
  });
  const [showD, setShowD] = React.useState(false);

  React.useEffect(() => {
    const assetWithID = props.assets.find(
      (a: Asset) => a.id === id
    );
    if (assetWithID) { setChosenAsset(assetWithID); }
  }, [id, props.assets, props.assets[0]]); // run this function when metadata filled

  const loansToShow = props.loans.filter(
    (l: Loan) => l.asset_id === chosenAsset.id && l.state === "0"
  );

  return (
    <div style={{ padding: 10 }}>
      <Dialog
        open={showD}
        onClose={() => setShowD(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Checkout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              You are about to borrow 1 {chosenAsset.name} for {chosenLoan.duration} seconds.
            </p>
            <p>
              This will cost you {chosenLoan.cost} + {chosenLoan.deposit} = <b>{+chosenLoan.cost + +chosenLoan.deposit}</b> SAND.
            </p>
            <p>
              You must return the item before <b>{new Date(Date.now()).toLocaleDateString()}</b> at <b>{new Date(Date.now()).toLocaleTimeString()}</b>, or you forfeit your deposit of {chosenLoan.deposit} SAND.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              buyAsset(
                props.poolInst,
                props.accounts[0],
                props.loans.indexOf(chosenLoan).toString()
              );
            }
            }
          >
            Take out loan
            <ArrowForwardIosIcon />
          </Button>
        </DialogActions>
      </Dialog>
      <AssetCard
        asset={chosenAsset}
        balance={props.assetBalances[props.tokenids.indexOf(chosenAsset.id)]}
      />
      <div style={{ backgroundColor: "#1b2030", paddingTop: 4 }}>
        <h2>Loans</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Loaner</TableCell>
                <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Cost</TableCell>
                <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Deposit</TableCell>
                <TableCell style={{ color: "white", fontSize: '1.3rem' }}>
                  Duration
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loansToShow.map((l: Loan) => (
                <TableRow key={l.cost}>
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
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: '1rem' }}>
                    <span>
                      <img
                        style={{ width: 20 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.cost}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: '1rem' }}>
                    <span>
                      <img
                        style={{ width: 20 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.deposit}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: '1rem' }}>{l.duration} seconds</TableCell>
                  <TableCell style={{ color: "white" }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setChosenLoan(l);
                        setShowD(true);
                      }
                      }
                    >
                      Take out loan
                      <ArrowForwardIosIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default AssetPage;
