import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell, DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { GLTFModel, AmbientLight } from 'react-3d-viewer'

interface ParamTypes {
  id: string
}

interface AssetPageProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: Record<string, number>;
  assets: Asset[];
}

interface AssetCardProps {
  asset: Asset, balance: number, loans: Loan[]
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptLoan(index).send({ from: from });
};

export const formatSand = (amount: number) =>
  <div>
    <span>
      <img
        style={{ width: 20, paddingRight: 5 }}
        src={sandIcon}
        alt="SAND logo"
      />
    </span>
    {amount}
  </div>

const position = { x: 0, y: 0, z: 0 };
const AssetCard = (props: AssetCardProps) => {
  const [rotation, setRotation] = useState({ x: 0.3, y: 0, z: 0 });
  const [showModel, setShowModel] = useState(0);

  useEffect(() => {
    let interval: any = null;
    const obj = { x: rotation.x, y: rotation.y + 0.01, z: rotation.z };
    interval = setInterval(() => {
      setRotation(obj); setModel(
        <GLTFModel
          width={300}
          height={250}
          enableZoom={false}
          src={`https://ipfs.io/ipfs/${props.asset.animation_url}`}
          position={position}
          rotation={obj} >
          <AmbientLight color='white' />
        </GLTFModel>)
    }, 10);

    return () => clearInterval(interval);
  });

  const [model, setModel] = useState(<></>);

  const numberOfLoans = props.loans.filter(
    (l: Loan) =>
      l.asset_id === props.asset.id &&
      l.state === "0" && Date.now() < l.entry * 1000 + l.duration * 1000
  ).length;

  return (
    <div>
      <Link style={{ textDecoration: "none" }} to="/assets">
        <Button variant="contained" style={{ margin: 8, fontSize: "1em" }}>
          <ArrowBackIosIcon />
          Back
        </Button>
      </Link>
      <div style={{
        display: "flex",
      }} >
        <div style={{
          border: '3px solid purple',
          borderRadius: 25,
          display: "flex",
          flexDirection: 'column',
          marginRight: 30,
          padding: 20,
        }}>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={showModel}
              onChange={(e: any) => setShowModel(e.target.value as number)}
              style={{ padding: 10, marginBottom: 10, color: 'white' }}
            >
              <MenuItem value={0}>
                Preview
              </MenuItem>
              <MenuItem value={1}>
                View 3D
            </MenuItem>
            </Select>
          </FormControl>
          {showModel === 1 ?
            model :
            <img
              alt="missing metadata"
              src={`https://ipfs.io/ipfs/${props.asset.image}`}
              style={{
                objectFit: "contain",
                width: 300,
                height: 250,
              }}
            />}
        </div>
        <div style={{ width: "100%" }}>
          <h1>{props.asset.name}</h1>
          <h4 style={{ color: 'lightgrey' }}>Token ID: {props.asset.id.slice(0, 4)}...{props.asset.id.slice(-4)}</h4>
          <h4 style={{ color: 'lightgrey' }}>{props.balance} owned by you | {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available</h4>
          <h2>About</h2>
          <div
            style={{
              padding: 8,
              borderStyle: "solid",
              backgroundColor: "#1b2040",
            }}
          >
            {props.asset.description}
            <Grid container spacing={10}>
              <Grid item><h4>Type</h4> {props.asset.sandbox.classification.type}</Grid>
              <Grid item><h4>Biome</h4>{props.asset.sandbox.classification.theme}</Grid>
              <Grid item><h4>Tags</h4>{props.asset.sandbox.classification.categories.join(", ")}</Grid>
            </Grid>
          </div>
        </div>
      </div >
    </div >
  );
};

const AssetPage = (props: AssetPageProps) => {
  let { id } = useParams<ParamTypes>();

  const [chosenAsset, setChosenAsset] = React.useState(props.assets[0]);
  const [chosenLoan, setChosenLoan] = React.useState({
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
  const [showD, setShowD] = React.useState(false);

  React.useEffect(() => {
    const assetWithID = props.assets.find(
      (a: Asset) => a.id === id
    );
    if (assetWithID) { setChosenAsset(assetWithID); }
    // eslint-disable-next-line
  }, [id, props.assets, props.assets[0]]); // run this function when metadata filled

  const loansToShow = props.loans.filter(
    (l: Loan) => l.asset_id === chosenAsset.id && l.state === "0" && Date.now() < l.entry * 1000 + l.duration * 1000
  );

  const table =
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Loaner</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Cost per second</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Deposit</TableCell>
            <TableCell style={{ color: "white", fontSize: '1.3rem' }}>Available until</TableCell>
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
                      color={`#${l.loaner.slice(2, 5)}`}
                      bgColor={`#${l.loaner.slice(2 + 3, 5 + 3)}`}
                      spotColor={`#${l.loaner.slice(2 + 6, 5 + 6)}`}
                      className="identicon"
                    />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell style={{ color: "white", fontSize: '1rem' }}>
                {formatSand(l.cost)}
              </TableCell>
              <TableCell style={{ color: "white", fontSize: '1rem' }}>
                {formatSand(l.deposit)}
              </TableCell>
              <TableCell style={{ color: "white", fontSize: '1rem' }}>{new Date(l.entry * 1000 + l.duration * 1000).toLocaleDateString()}</TableCell>
              <TableCell style={{ color: "white" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setChosenLoan(l);
                    setShowD(true);
                  }}
                >
                  Take out loan
                <ArrowForwardIosIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>;

  const dialog =
    <Dialog
      open={showD}
      onClose={() => setShowD(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{chosenAsset.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div style={{
            display: "flex",
          }}>
            <div style={{
              border: '3px solid purple',
              borderRadius: 25,
              marginRight: 10,
              padding: 20,
            }}>
              <img
                alt="missing metadata"
                src={`https://ipfs.io/ipfs/${chosenAsset.image}`}
                style={{
                  objectFit: "contain",
                  width: 200,
                  height: 220,
                }}
              />
            </div>
            <div>
              <div style={{ borderStyle: 'solid', padding: 5 }}>
                <div style={{ display: 'flex' }}>
                  Owner:
                  <Tooltip title={chosenLoan.loaner}>
                    <div>
                      <Blockies
                        seed={chosenLoan.loaner}
                        size={10}
                        scale={3}
                        color={`#${chosenLoan.loaner.slice(2, 5)}`}
                        bgColor={`#${chosenLoan.loaner.slice(2 + 3, 5 + 3)}`}
                        spotColor={`#${chosenLoan.loaner.slice(2 + 6, 5 + 6)}`}
                        className="identicon"
                      />
                    </div>
                  </Tooltip>
                </div>
                  Available until: {new Date(chosenLoan.entry * 1000 + chosenLoan.duration * 1000).toLocaleString()}
              </div>
              <div style={{ borderStyle: 'solid', padding: 5, borderTop: 0 }}>
                <h3>Terms:</h3>
                {formatSand(chosenLoan.deposit)}
                <br />
                {formatSand(chosenLoan.cost)}
              </div>
            </div>
          </div>
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
          Agree to terms and Deposit {chosenLoan.deposit} SAND
          <ArrowForwardIosIcon />
        </Button>
      </DialogActions>
    </Dialog>;

  return (
    <div style={{ padding: 10 }}>
      {dialog}
      <AssetCard
        asset={chosenAsset}
        balance={props.assetBalances[chosenAsset.id]}
        loans={props.loans}
      />
      <div style={{ backgroundColor: "#1b2030", paddingTop: 4 }}>
        <h2 style={{ textAlign: 'center' }}>Loans</h2>
        {table}
      </div>
    </div >
  );
};

export default AssetPage;
