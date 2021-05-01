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

const transferAsset = (inst: any, from: string, to: string, id: string) => {
  inst.methods.safeTransferFrom(from, to, id, 1, "0x00").send({ from: from }).then(console.log).catch(console.error);
}

const Marketplace = (props: MarketplaceProps) => {
  const AssetCard = (a: Asset, balance: number) => (
    <div className="productCard">
      <div className="card-container-data">
        <img
          alt={"missing metadata"}
          style={{ objectFit: "contain" }}
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div className="cardData">
          <h3>
            {a.name} | {a.classification.theme}
          </h3>
          <h4>Token ID: {a.id.slice(0, 10)}...</h4>
        </div>
        <div style={{ display: "flex" }}>
          <p>You own {balance}</p>
          <button onClick={() => transferAsset(props.assetTokenInst, props.accounts[0], "0xf768524df0f3a766df8cae83243dc772b291f00c", a.id)}>TRANSFER 1</button>
        </div>
      </div>
    </div >
  );

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
        <h2>Assets</h2>
        <button onClick={onClick}>
          {showOwned ? "Click me to show all assets" : "Click me to show just your assets"}
        </button>
        <div className="card-container">
          {assetsToShow}
        </div>
      </div>
    </div >
  );
};

export default Marketplace;
