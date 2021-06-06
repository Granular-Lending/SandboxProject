import React from "react";
import { Asset, Loan } from "../../App";
import "./Marketplace.css";
import { Switch, Route, Link } from "react-router-dom";
import AssetPage from "./AssetPage";
import CreateLoanChoice from "./CreateLoanChoice";
import YourLoansPage from "./YourLoansPage";
import YourBorrowsPage from "./YourBorrowsPage";
import Sample from "./Whitepaper";
import Permissions from "../Permissions/Permissions";
import { Button, FormControl, MenuItem, Select } from "@material-ui/core";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
  poolInst: any;
  loans: Loan[];
  sandBalance: number;
  sym: string;
  sandTokenInst: any;
  poolAddress: string;
  assetsApproved: boolean;
  sandAllowance: boolean;
}

interface HomeProps {
  sym: string;
}
const Home = (props: HomeProps) => {
  return <div style={{ padding: 10 }} data-label="Home">
    <h1>Introduction</h1>
    <h2>Borrow & lend NFT's from The Sandbox!</h2>
    <h3>Tokens</h3>
    <p style={{ color: "white" }}>
      The project is currently in testing, so loans are bought with the Ropsten Faucet ({props.sym}) token. Get some free {props.sym} <a href="https://erc20faucet.com/" target="_blank" rel="noreferrer">here</a>.
    </p>
    <h3>Permissions</h3>
    <p style={{ color: "white" }}>
      To create or take out a loan, we need approval to transfer
      both {props.sym} tokens and ASSETS on your behalf. Head to the Permissions page
      and click 'approve' on both buttons.
    </p>
    <h3>Taking out a loan</h3>
    <p style={{ color: "white" }}>
      To take out a loan, head to the Assets page and click on an ASSET. The current loans are listed at the bottom of the page. Click "take out loan" to accept the terms of the
      loan.
      </p>
    <p>
      You will now be able to see the loan on the "Your Borrows" page.
    </p>
    <h3>Creating a loan</h3>
    <p style={{ color: "white" }}>
      To create out a loan, head to the Your Loans page. Click "create a loan",
      then select an ASSET and the terms of the loan.
    </p>
    <h3>Whitepaper</h3>
    <Link to="/whitepaper">
      <Button variant='contained' style={{ margin: 8, fontSize: '1em' }}>
        View the whitepaper
      </Button>
    </Link>
  </div >
};

const Marketplace = (props: MarketplaceProps) => {
  const AssetCard = (a: Asset, balance: number) => {
    const numberOfLoans = props.loans.filter(
      (l: Loan) =>
        l.asset_id === a.id &&
        l.state === "0" && Date.now() < l.entry * 1000 + l.duration * 1000
    ).length;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/asset/${a.id}`}
      >
        <div className="productCard">
          <div className="card-container-data">
            <img
              alt="missing metadata"
              style={{ objectFit: "contain" }}
              src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
            />
            <div className="cardData">
              <h3>{a.name.length > 22 ? `${a.name.slice(0, 22)}...` : a.name}</h3>
              <h4 style={{ color: 'lightgrey' }}>
                {a.sandbox.classification.type} | {a.sandbox.classification.theme}
              </h4>
              <p>
                {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"}{" "}
                available
              </p>
            </div>
          </div>
        </div>
      </Link >
    );
  };

  const Assets = () => {
    const [assetType, setAssetType] = React.useState("All");

    return <div data-label="Assets">
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assetType}
          onChange={(e: any) => setAssetType(e.target.value as string)}
          style={{ margin: 20, color: 'white' }}
        >
          <MenuItem value={"All"}>
            All
                </MenuItem>
          <MenuItem value={"Entity"}>
            Entity
                </MenuItem>
          <MenuItem value={"Equipment"}>
            Equipment
                </MenuItem>
        </Select>
      </FormControl>
      <div className="card-container">
        {props.assets.filter((a: Asset) => a.sandbox.classification.type === assetType || assetType === 'All').map((a: Asset) =>
          AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
        )}
      </div>
    </div>
  };

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <Switch>
          <Route path="/assets">
            <Assets />
          </Route>
          <Route path="/asset/:id">
            <AssetPage
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              assets={props.assets}
            />
          </Route>
          <Route path="/whitepaper">
            <Sample
            />
          </Route>
          <Route path="/createLoan">
            <CreateLoanChoice
              assets={props.assets}
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourLoans">
            <YourLoansPage
              assets={props.assets}
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourBorrows">
            <YourBorrowsPage
              assets={props.assets}
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/permissions">
            <Permissions
              assetsApproved={props.assetsApproved}
              sandAllowance={props.sandAllowance}
              accounts={props.accounts}
              sym={props.sym}
              sandBalance={props.sandBalance}
              sandTokenInst={props.sandTokenInst}
              assetTokenInst={props.assetTokenInst}
              poolAddress={props.poolAddress}
            />
          </Route>
          <Route path="/">
            <Home sym={props.sym} />
          </Route>
        </Switch>
      </div>
    </div >
  );
};

export default Marketplace;
