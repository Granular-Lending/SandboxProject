import React, { useState } from "react";
import { Asset, Loan } from "../../App";
import "./Marketplace.css";
import { Switch, Route, Link } from "react-router-dom";
import AssetPage from "./AssetPage";
import CreateLoan from "./CreateLoan";
import CreateLoanChoice from "./CreateLoanChoice";
import YourLoansPage from "./YourLoansPage";
import YourBorrowsPage from "./YourBorrowsPage";
import Sample from "./Whitepaper";
import Sidebar from "../Sidebar/Sidebar";
import { Button } from "@material-ui/core";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  assetBalancesPool: number[];
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
  poolInst: any;
  loans: Loan[];
  landBalance: number;
  sandBalance: number;
  sym: string;
  sandTokenInst: any;
}

interface HomeProps {
  sym: string;
}
const Home = (props: HomeProps) => {
  return <div style={{ padding: 10 }} data-label="Home">
    <h1>Introduction</h1>
    <p style={{ color: "white" }}>
      Granular Lending is a portal that lets you loan & borrow Sandbox NFT's.
    </p>
    <h3>Permissions</h3>
    <p style={{ color: "white" }}>
      Firstly, to create or take out a loan, we need your approval to transfer
      both {props.sym} tokens and ASSETS on your behalf. Head to the Permissions page
      and click 'approve' on both buttons.
    </p>
    <h3>Taking out a loan</h3>
    <p style={{ color: "white" }}>
      To take out a loan, head to the Assets page and click on an ASSET to learn
      more about it. The current loans are listed at the bottom of the page,
      along with their terms. Click "borrow item" to accept the terms of the
      loan. You will now be able to see the loan on the "Your Borrows" page.
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
  </div>
};

const Marketplace = (props: MarketplaceProps) => {
  const [chosenAsset, setChosenAsset] = useState(props.assets[0]);

  const handleOpenBrowse = (a: Asset) => {
    setChosenAsset(a);
  };

  const AssetCard = (a: Asset, balance: number) => {
    const numberOfLoans = props.loans.filter(
      (l: Loan) =>
        l.asset_id === a.id &&
        l.borrower === "0x0000000000000000000000000000000000000000"
    ).length;
    return (
      <Link
        style={{ textDecoration: "none" }}
        to="/asset"
        onClick={() => handleOpenBrowse(a)}
      >
        <div className="productCard">
          <div className="card-container-data">
            <img
              alt="missing metadata"
              style={{ objectFit: "contain" }}
              src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
            />
            <div className="cardData">
              <h3>{a.name}</h3>
              <h4>
                {a.classification.type} | {a.classification.theme}
              </h4>
              <p>
                {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"}{" "}
                available
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const Assets = () => (
    <div data-label="Assets">
      <div className="card-container">
        {props.assets.map((a: Asset) =>
          AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
        )}
      </div>
    </div>
  );

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <Switch>
          <Route path="/asset">
            <AssetPage
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              a={chosenAsset}
            />
          </Route>
          <Route path="/whitepaper">
            <Sample
            />
          </Route>
          <Route path="/createLoanChoice">
            <CreateLoanChoice
              assets={props.assets}
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/createLoan">
            <CreateLoan
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              a={chosenAsset}
            />
          </Route>
          <Route path="/assets">
            <Assets />
          </Route>
          <Route path="/yourLoans">
            <YourLoansPage
              assets={props.assets}
              tokenids={props.tokenids}
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              a={chosenAsset}
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
              a={chosenAsset}
            />
          </Route>
          <Route path="/permissions">
            <Sidebar
              accounts={props.accounts}
              sym={props.sym}
              sandBalance={props.sandBalance}
              landBalance={props.landBalance}
              sandTokenInst={props.sandTokenInst}
              assetTokenInst={props.assetTokenInst}
            />
          </Route>
          <Route path="/">
            <Home sym={props.sym} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Marketplace;
