import React, { useState } from "react";
import { Asset, Loan } from "../../App";
import "./Marketplace.css";
import { Button } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Loans from "./Loans";
import CreateLoan from "./CreateLoan";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  assetBalancesPool: number[]
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
  poolInst: any;
  sales: Loan[];
}

const Home = () =>
  <div data-label="Home">
    <div style={{ color: 'white' }}>
      Granular Lending is a portal that lets you loan & borrow Sandbox NFT's.
      </div>
  </div>;


const Marketplace = (props: MarketplaceProps) => {
  const [chosenAsset, setChosenAsset] = useState(
    {
      id: "",
      name: "missing metadata",
      description: "missing metadata",
      image: "missing metadata",
      creator_profile_url: "missing metadata",
      classification: {
        type: "missing metadata",
        theme: "missing metadata",
        categories: [""],
      }
    }
  );

  const handleOpenBrowse = (a: Asset) => {
    setChosenAsset(a);
  };

  const AssetCard = (a: Asset, balance: number) => {
    return <div className="productCard">
      <div className="card-container-data">
        <img
          alt="missing metadata"
          style={{ objectFit: "contain" }}
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div className="cardData">
          <h3>
            {a.name}
          </h3>
          <h4>{a.classification.type} | {a.classification.theme}</h4>

          <p>You own {balance}</p>
          <Button variant='contained' color='primary' onClick={() => handleOpenBrowse(a)} style={{ margin: 8, fontSize: '1em' }}>
            <Link to="/asset">View loans</Link>
          </Button>
        </div>
      </div>
    </div>
  };

  const Assets = () =>
    <div data-label="Assets">
      <div className="card-container">
        {props.assets.map((a: Asset) =>
          AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)]))
        }
      </div>
    </div>

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <Switch>
          <Route path="/asset">
            <Loans sales={props.sales} poolInst={props.poolInst} accounts={props.accounts} a={chosenAsset} />
          </Route>
          <Route path="/createLoan">
            <CreateLoan sales={props.sales} poolInst={props.poolInst} accounts={props.accounts} a={chosenAsset} />
          </Route>
          <Route path="/assets">
            <Assets />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Marketplace;
