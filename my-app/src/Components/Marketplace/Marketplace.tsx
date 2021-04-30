import React, { useState } from "react";
import { Asset } from "../../App";

import "./Marketplace.css";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
}

const AssetCard = (a: Asset, balance: number) => (
  <div className="productCard">
    <div className="card-container-data">
      <img
        alt={"missing metadata"}
        style={{ height: "50px" }}
        src={process.env.PUBLIC_URL + `/equipment/${a.id}.png`}
      />                        
      <div className="cardData">
        <h3>
          {a.name} | {a.classification.theme}
        </h3>
        <h4>Token ID: {a.id.slice(0, 10)}...</h4>
        <p>You own {balance}</p>
      </div>
    </div>
  </div>
);

const Marketplace = (props: MarketplaceProps) => {
  const [showOwned, setShowOwned] = useState(false);
  const [assetsToShow, setAssetsToShow] = useState(
    props.assets.map((a: Asset) =>
      AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
    )
  );

  const onClick = () => {
    setAssetsToShow(
      props.assets.map((a: Asset) =>
        showOwned || props.assetBalances[props.tokenids.indexOf(a.id)] > 0 ? (
          AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
        ) : (
          <></>
        )
      )
    );

    setShowOwned(!showOwned);
  };

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <h2>Asset Marketplace</h2>
        <button onClick={onClick}>
          Show assets you own? {showOwned ? "YES" : "NO"}
        </button>                
        <div className="card-container">
          {assetsToShow}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
