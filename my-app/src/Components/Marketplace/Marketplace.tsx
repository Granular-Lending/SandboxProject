import React from "react";
import { NFT, Loan, Verse, ERC20 } from "../../App";
import "./Marketplace.css";
import { Switch, Route, Link } from "react-router-dom";
import AssetPage from "./AssetPage";
import CreateLoanChoice from "./CreateLoanChoice";
import YourLoansPage from "./YourLoansPage";
import YourBorrowsPage from "./YourBorrowsPage";
import Sample from "./Whitepaper";
import Permissions from "../Permissions/Permissions";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import Home from "./Home";
import sandIcon from "./assets/sandIcon.png";

interface MarketplaceProps {
  addPendingLoans: (temp: Loan[], poolInstTemp: any, account: string) => void;
  nfts: NFT[];
  accounts: string[];
  loans: Loan[];
  verses: Verse[];
  sandToken: ERC20;
  poolInst: any;
}

interface AssetsProps {
  assets: NFT[];
  loans: Loan[]
  verses: Verse[]
}

export interface DeProps {
  verseType: string, verses: Verse[], loans: Loan[], assets: NFT[]
}

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

const GenericCard = (a: NFT, loans: Loan[]) => {
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
      <div className="productCardGeneric">
        <div className="card-container-data">
          <img
            alt="missing metadata"
            style={{ objectFit: "contain" }}
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name}</h3>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
            <p>
              {a.verseObj.name}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

export const GenericMarketplace = (props: DeProps) => {
  return <div>
    <div className="card-container" style={{ backgroundColor: 'white' }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verseObj.name)).map((a: NFT) =>
          GenericCard(a, props.loans)
        )}
    </div>
  </div>;
}


const Assets = (props: AssetsProps) => {
  const VERSE_OPTIONS = ["Any"].concat(props.verses.map((v: Verse) => v.name));

  const [verseType, setVerseType] = React.useState(VERSE_OPTIONS[0]);

  const x = props.verses.find((v: Verse) => v.name === verseType);
  let Hi = GenericMarketplace;
  if (x) {
    Hi = x.marketplace;
  }
  return <div data-label="Assets">
    <div style={{ backgroundColor: "grey" }}>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Verse</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={verseType}
          onChange={(e: any) => {
            setVerseType(e.target.value as string);
          }}
          style={{ margin: 20, color: 'white' }}
        >
          {VERSE_OPTIONS.map((o: string) =>
            <MenuItem value={o}>
              {o}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
    <Hi verseType={verseType} verses={props.verses} loans={props.loans} assets={props.assets} />
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
              assets={props.nfts}
              verses={props.verses}
            />
          </Route>
          <Route path="/asset/:id">
            <AssetPage
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
              assets={props.nfts}
            />
          </Route>
          <Route path="/whitepaper">
            <Sample />
          </Route>
          <Route path="/createLoan">
            <CreateLoanChoice
              assets={props.nfts}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourLoans">
            <YourLoansPage
              addPendingLoans={props.addPendingLoans}
              assets={props.nfts}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/yourBorrows">
            <YourBorrowsPage
              addPendingLoans={props.addPendingLoans}
              assets={props.nfts}
              loans={props.loans}
              poolInst={props.poolInst}
              accounts={props.accounts}
            />
          </Route>
          <Route path="/permissions">
            <Permissions
              accounts={props.accounts}
              verses={props.verses}
              poolInst={props.poolInst}
              sandToken={props.sandToken}
            />
          </Route>
          <Route path="/">
            <Home sym={props.sandToken.symbol} />
          </Route>
        </Switch>
      </div>
    </div >
  );
};

export default Marketplace;
