import { NFT, Loan } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { DeProps } from "./Marketplace";
import PetsIcon from '@material-ui/icons/Pets';
import ColorizeIcon from '@material-ui/icons/Colorize';

const ICON_MAPPING: Record<string, any> = { 'Equipment': <ColorizeIcon />, 'Entity': <PetsIcon /> }

const NftCard = (a: NFT, loans: Loan[]) => {
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
          <div style={{ display: 'flex' }}>
            {ICON_MAPPING[a.metadata.sandbox.classification.type]}
            <img
              alt="missing metadata"
              style={{ objectFit: "contain" }}
              src={a.metadata.image}
            />
          </div>
          <div className="cardData">
            <h3>{a.metadata.name.length > 22 ? `${a.metadata.name.slice(0, 22)}...` : a.metadata.name}</h3>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
          </div>
        </div>
      </div>
    </Link >
  );

};

const SANDBOX_OPTIONS = ["All", "Equipment", "Entity"];
const THEME_OPTIONS = ["All", "Sci-Fi", "Retro", "Nature"];

const SandboxMarketplace = (props: DeProps) => {
  const [sandboxType, setSandboxType] = React.useState(SANDBOX_OPTIONS[0]);
  const [theme, setTheme] = React.useState(THEME_OPTIONS[0]);

  return <div>
    <div style={{ backgroundColor: 'darkGrey' }}>
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
    <div className="card-container" style={{ backgroundColor: "#1b2026" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === a.verseObj.name && (sandboxType === "All" || sandboxType === a.metadata.sandbox.classification.type) && (theme === "All" || theme === a.metadata.sandbox.classification.theme))).map((a: NFT) => {
          return NftCard(a, props.loans)
        }
        )}
    </div>
  </div>;
}


export default SandboxMarketplace;
