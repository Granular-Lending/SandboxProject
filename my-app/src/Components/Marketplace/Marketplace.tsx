import React, { useState } from "react";
import { Asset } from "../../App";

import "./Marketplace.css";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  assetBalancesPool: number[]
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
  poolInst: any
}

const transferAsset = (inst: any, from: string, to: string, id: string) => {
  inst.methods.safeTransferFrom(from, to, id, 1, "0x00").send({ from: from }).then(console.log).catch(console.error);
}

const retrieveAsset = (inst: any, from: string, id: string) => {
  inst.methods.retrieve(id).send({ from: from }).then(console.log).catch(console.error);
}

const Marketplace = (props: MarketplaceProps) => {
  const AssetCard = (a: Asset, balance: number, balancePool: number) => (
    <div className="productCard">
      <div className="card-container-data">
        <img
          alt={"missing metadata"}
          style={{ objectFit: "contain" }}
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div className="cardData">
          <h3>
            {a.name}
          </h3>
          <h4>{a.classification.theme} | ID: {a.id.slice(0, 10)}... </h4>
        </div>
        <div style={{ display: "flex" }}>
          <p>You own {balance}</p>
          <p>Pool owns {balancePool}</p>
          <button onClick={() => transferAsset(props.assetTokenInst, props.accounts[0], "0x3b20F0B97290c4BF2cEA6DEf9340CEb5fd8f36E3", a.id)}>PUT 1 IN POOl</button>
          <button onClick={() => retrieveAsset(props.poolInst, props.accounts[0], a.id)}>TAKE 1 OUT OF POOl</button>
        </div>
      </div>
    </div >
  );

  const [showOwned, setShowOwned] = useState(false);
  const [assetsToShow, setAssetsToShow] = useState(
    props.assets.map((a: Asset) =>
      AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)], props.assetBalancesPool[props.tokenids.indexOf(a.id)])
    )
  );

  const onClick = () => {
    setAssetsToShow(
      props.assets.map((a: Asset) =>
        showOwned || props.assetBalances[props.tokenids.indexOf(a.id)] > 0 ? (
          AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)], props.assetBalancesPool[props.tokenids.indexOf(a.id)])
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
