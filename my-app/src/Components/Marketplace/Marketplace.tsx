import React from "react";
import { NFT, Loan, Verse } from "../../App";
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

interface MarketplaceProps {
  addPendingLoans: (temp: Loan[], poolInstTemp: any, account: string) => void;
  nfts: NFT[];
  accounts: string[];
  loans: Loan[];
  sandBalance: number;
  sym: string;
  sandApproved: boolean;
  assetsApproved: boolean;
  dclAssetsApproved: boolean;
  verses: Verse[];
  sandTokenInst: any;
  poolInst: any;
}

export const SandboxAssetCard = (a: NFT, loans: Loan[]) => {
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
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name.length > 22 ? `${a.metadata.name.slice(0, 22)}...` : a.metadata.name}</h3>
            <h4 style={{ color: 'lightgrey' }}>
              {`${a.metadata.sandbox.classification.type} | ${a.metadata.sandbox.classification.theme}`}
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

export const DecentralandAssetCard = (a: NFT, loans: Loan[]) => {
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
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name}</h3>
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


export const DeNationsAssetCard = (a: NFT, loans: Loan[]) => {
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
      <div className="productCardDeNations">
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
              {a.verse}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

interface AssetsProps {
  assets: NFT[];
  loans: Loan[]
  verses: Verse[]
}

interface DeProps {
  verseType: string, verses: Verse[], loans: Loan[], assets: NFT[]
}

export const SandboxMarketplace = (props: DeProps) => {
  const SANDBOX_OPTIONS = ["All", "Equipment", "Entity"];
  const THEME_OPTIONS = ["All", "Sci-Fi", "Retro", "Nature"];
  const [sandboxType, setSandboxType] = React.useState(SANDBOX_OPTIONS[0]);
  const [theme, setTheme] = React.useState(THEME_OPTIONS[0]);

  return <div>
    <div style={{ backgroundColor: 'cyan' }}>
      <FormControl >
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sandboxType}
          onChange={(e: any) => setSandboxType(e.target.value as string)}
          style={{ margin: 20, color: 'white' }}
        >
          {SANDBOX_OPTIONS.map((o: string) =>
            <MenuItem value={o}>
              {o}
            </MenuItem>
          )}
        </Select>
      </FormControl >
      <FormControl >
        <InputLabel id="demo-simple-select-label">Theme</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={theme}
          onChange={(e: any) => setTheme(e.target.value as string)}
          style={{ margin: 20, color: 'white' }}
        >
          {THEME_OPTIONS.map((o: string) =>
            <MenuItem value={o}>
              {o}
            </MenuItem>
          )}
        </Select>
      </FormControl >
    </div>
    <div className="card-container" style={{ backgroundColor: "Blue" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === a.verse && (sandboxType === "All" || sandboxType === a.metadata.sandbox.classification.type) && (theme === "All" || theme === a.metadata.sandbox.classification.theme))).map((a: NFT) => {
          const x = props.verses.find((v: Verse) => v.name === a.verse);
          return x ? x.card(a, props.loans) : DecentralandAssetCard(a, props.loans)
        }
        )}
    </div>
  </div>;
}

export const AllMarketplace = (props: DeProps) => {
  return <div>
    <div className="card-container" >
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verse)).map((a: NFT) => {
          const x = props.verses.find((v: Verse) => v.name === a.verse);
          return x ? x.card(a, props.loans) : DecentralandAssetCard(a, props.loans)
        }
        )}
    </div>
  </div>;
}

export const DecentralandMarketplace = (props: DeProps) => {
  return <div>
    <div style={{ backgroundColor: 'lightred' }}>

    </div>
    <div className="card-container" style={{ backgroundColor: "Red" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verse)).map((a: NFT) => {
          const x = props.verses.find((v: Verse) => v.name === a.verse);
          return x ? x.card(a, props.loans) : DecentralandAssetCard(a, props.loans)
        }
        )}
    </div>
  </div>;
}

export const DeNationsMarketplace = (props: DeProps) => {
  const COUNTRIES = ["All", "EU", "G20"];
  const [sandboxType, setSandboxType] = React.useState(COUNTRIES[0]);

  return <div>
    <div style={{ backgroundColor: 'lightgreen' }}>
      <FormControl >
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sandboxType}
          onChange={(e: any) => setSandboxType(e.target.value as string)}
          style={{ margin: 20, color: 'white' }}
        >
          {COUNTRIES.map((o: string) =>
            <MenuItem value={o}>
              {o}
            </MenuItem>
          )}
        </Select>
      </FormControl >
    </div>
    <div className="card-container" style={{ backgroundColor: "green" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verse) && (sandboxType === "All" || sandboxType === a.metadata.attributes[0].value)).map((a: NFT) => {
          const x = props.verses.find((v: Verse) => v.name === a.verse);
          return x ? x.card(a, props.loans) : DecentralandAssetCard(a, props.loans)
        }
        )}
    </div>
  </div>;
}

const Assets = (props: AssetsProps) => {
  const VERSE_OPTIONS = ["Any"].concat(props.verses.map((v: Verse) => v.name));

  const [verseType, setVerseType] = React.useState(VERSE_OPTIONS[0]);

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
    {verseType === "DeNations" ?
      <DeNationsMarketplace verseType={verseType} verses={props.verses} loans={props.loans} assets={props.assets} /> :
      verseType === "Sandbox" ?
        <SandboxMarketplace verseType={verseType} verses={props.verses} loans={props.loans} assets={props.assets} /> :
        verseType === "Decentraland" ?
          <DecentralandMarketplace verseType={verseType} verses={props.verses} loans={props.loans} assets={props.assets} /> :
          <AllMarketplace verseType={verseType} verses={props.verses} loans={props.loans} assets={props.assets} />
    }
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
              assetsApproved={props.assetsApproved}
              sandApproved={props.sandApproved}
              accounts={props.accounts}
              sym={props.sym}
              sandTokenInst={props.sandTokenInst}
              verses={props.verses}
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
