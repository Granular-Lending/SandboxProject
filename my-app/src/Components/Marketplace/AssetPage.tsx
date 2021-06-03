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

interface ParamTypes {
  id: string
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptLoan(index).send({ from: from }).then(console.log);
};

const AssetCard = (a: Asset, balance: number) => {

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
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div style={{ width: "100%" }}>
          <h1>{a.name}</h1>
          <h3>You own {balance}</h3>
          <div
            style={{
              padding: 8,
              borderStyle: "solid",
              backgroundColor: "#1b2040",
            }}
          >
            <h3>{a.description}</h3>
            <h4>Type: {a.classification.type}</h4>
            <h4>Theme: {a.classification.theme}</h4>
            <h4>Categories: {a.classification.categories.join(", ")}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetPage = (props: PopupProps) => {
  let { id } = useParams<ParamTypes>();

  const [chosenAsset, setChosenAsset] = React.useState(props.assets[0]);

  React.useEffect(() => {
    const hi = props.assets.find(
      (a: Asset) => a.id === id
    );
    if (hi) { setChosenAsset(hi); }
  }, [id, props.assets]);

  const loansToShow = props.loans.filter(
    (l: Loan) => l.asset_id === chosenAsset.id && l.state === "0"
  );

  return (
    <div style={{ padding: 10 }}>
      {AssetCard(
        chosenAsset,
        props.assetBalances[props.tokenids.indexOf(chosenAsset.id)]
      )}
      <div style={{ backgroundColor: "#1b2030", paddingTop: 4 }}>
        <h2>Loans</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}>Item</TableCell>
                <TableCell style={{ color: "white" }}>Cost</TableCell>
                <TableCell style={{ color: "white" }}>Deposit</TableCell>
                <TableCell style={{ color: "white" }}>
                  Duration (seconds)
                </TableCell>
                <TableCell style={{ color: "white" }}>Loaner</TableCell>
                <TableCell style={{ color: "white" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loansToShow.map((l: Loan) => (
                <TableRow key={l.cost}>
                  <TableCell style={{ color: "white" }}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 25 }}
                      src={
                        process.env.PUBLIC_URL + `/equipment/${chosenAsset.image}`
                      }
                    />
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
                  <TableCell style={{ color: "white" }}>{l.duration}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    <Blockies
                      seed={l.loaner}
                      size={10}
                      scale={5}
                      color="#000"
                      bgColor="#ffe"
                      spotColor="#fff"
                      className="identicon"
                    />{l.loaner}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        buyAsset(
                          props.poolInst,
                          props.accounts[0],
                          props.loans.indexOf(l).toString()
                        )
                      }
                    >
                      Borrow item
                      <ArrowForwardIosIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AssetPage;
