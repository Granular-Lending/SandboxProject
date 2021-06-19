import { NFT, Loan, Verse } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const COLOR_MAPPING: Record<string, string> = { 'common': 'grey', 'rare': 'blue', 'epic': 'purple', 'legendary': 'orange' }


interface DeProps {
  verseType: string, verses: Verse[], loans: Loan[], assets: NFT[]
}

const DeNationsAssetCard = (a: NFT, loans: Loan[]) => {
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
            <p style={{ backgroundColor: COLOR_MAPPING[a.metadata.attributes["rarity"]] }}>{a.metadata.attributes["rarity"]}</p>
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

const Rarity = ["All", "common", "rare", "epic", "legendary"];
const CryptoVoxelsMarketplace = (props: DeProps) => {
  const [rarity, setRarity] = React.useState(Rarity[0]);

  return <div>
    <div style={{ backgroundColor: 'white' }}>
      <FormControl >
        <InputLabel id="demo-simple-select-label">Rarity</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={rarity}
          onChange={(e: any) => setRarity(e.target.value as string)}
          style={{ margin: 20, color: 'black' }}
        >
          {Rarity.map((o: string) =>
            <MenuItem value={o}>
              {o}
            </MenuItem>
          )}
        </Select>
      </FormControl >
    </div>
    <div className="card-container" style={{ backgroundColor: "white" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verseObj.name) && (rarity === "All" || rarity === a.metadata.attributes["rarity"])).map((a: NFT) =>
          DeNationsAssetCard(a, props.loans)
        )}
    </div>
  </div>;
}

export default CryptoVoxelsMarketplace;
