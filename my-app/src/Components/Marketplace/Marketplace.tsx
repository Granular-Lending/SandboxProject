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
import { FormControl, MenuItem, Select } from "@material-ui/core";
import Home from "./Home";

interface MarketplaceProps {
  addPendingLoans: (temp: Loan[], poolInstTemp: any, account: string) => void;
  assets: Asset[];
  assetBalances: Record<string, number>;
  accounts: string[];
  loans: Loan[];
  sandBalance: number;
  sym: string;
  sandApproved: boolean;
  assetsApproved: boolean;
  sandTokenInst: any;
  sandboxNFTInst: any;
  decentralandNFTInst: any;
  poolInst: any;
}

const SandboxAssetCard = (a: Asset, loans: Loan[]) => {
  const numberOfLoans = loans.filter(
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
            src={a.image}
          />
          <div className="cardData">
            <h3>{a.name.length > 22 ? `${a.name.slice(0, 22)}...` : a.name}</h3>
            <h4 style={{ color: 'lightgrey' }}>
              {`${a.sandbox.classification.type} | ${a.sandbox.classification.theme}`}
            </h4>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
            <p>
              {a.verse}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

const DecentralandAssetCard = (a: Asset, loans: Loan[]) => {
  const numberOfLoans = loans.filter(
    (l: Loan) =>
      l.asset_id === a.id &&
      l.state === "0" && Date.now() < l.entry * 1000 + l.duration * 1000
  ).length;
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/asset/${a.id}`}
    >
      <div className="productCardDec">
        <div className="card-container-data">
          <img
            alt="missing metadata"
            style={{ objectFit: "contain" }}
            src={a.image}
          />
          <div className="cardData">
            <h3>{a.name}</h3>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
            <p>
              {a.verse}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

interface AssetsProps {
  assets: Asset[];
  loans: Loan[]
}

const VERSE_OPTIONS = ["Any", "Sandbox", "Decentraland"]
const SANDBOX_OPTIONS = ["All", "Entity", "Equipment"]

const Assets = (props: AssetsProps) => {
  const [verseType, setVerseType] = React.useState(VERSE_OPTIONS[0]);
  const [assetType, setAssetType] = React.useState(SANDBOX_OPTIONS[0]);

  return <div data-label="Assets">
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={verseType}
        onChange={(e: any) => setVerseType(e.target.value as string)}
        style={{ margin: 20, color: 'white' }}
      >
        {VERSE_OPTIONS.map((o: string) =>
          <MenuItem value={o}>
            {o}
          </MenuItem>
        )}
      </Select>
    </FormControl>
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={assetType}
        onChange={(e: any) => setAssetType(e.target.value as string)}
        style={{ margin: 20, color: 'white' }}
      >
        {SANDBOX_OPTIONS.map((o: string) =>
          <MenuItem value={o}>
            {o}
          </MenuItem>
        )}
      </Select>
    </FormControl>
    <div className="card-container">
      {/* TODO make this rebuild when metadata loads */ props.assets.filter((a: Asset) => (verseType === "Any" || verseType === a.verse)).map((a: Asset) => a.verse === "Sandbox" ? SandboxAssetCard(a, props.loans) : DecentralandAssetCard(a, props.loans)
      )}
    </div>
  </div >
};

const Marketplace = (props: MarketplaceProps) => {
  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <Switch>
          <Route path="/assets">
            <Assets
              loans={props.loans}
              assets={props.assets}
            />
          </Route>
          <Route path="/asset/:id">
            <AssetPage
              assetBalances={props.assetBalances}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              assets={props.assets}
            />
          </Route>
          <Route path="/whitepaper">
            <Sample />
          </Route>
          <Route path="/createLoan">
            <CreateLoanChoice
              assets={props.assets}
              assetBalances={props.assetBalances}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourLoans">
            <YourLoansPage
              addPendingLoans={props.addPendingLoans}
              assets={props.assets}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourBorrows">
            <YourBorrowsPage
              addPendingLoans={props.addPendingLoans}
              assets={props.assets}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/permissions">
            <Permissions
              assetsApproved={props.assetsApproved}
              sandApproved={props.sandApproved}
              accounts={props.accounts}
              sym={props.sym}
              sandTokenInst={props.sandTokenInst}
              sandboxNFTInst={props.sandboxNFTInst}
              decentralandNFTInst={props.decentralandNFTInst}
              poolInst={props.poolInst}
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
