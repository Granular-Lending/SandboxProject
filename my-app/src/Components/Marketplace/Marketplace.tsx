import React from "react";
import Tabs from "../Tabs/Tabs";
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
        <h3>
          {a.name}
        </h3>
        <h4>{a.classification.theme}</h4>
        <p>You own {balance}</p>
        <p>Pool owns {balancePool}</p>
        <div style={{ display: "flex" }}>
          <button onClick={() => transferAsset(props.assetTokenInst, props.accounts[0], "0x3b20F0B97290c4BF2cEA6DEf9340CEb5fd8f36E3", a.id)}>PUT 1 IN POOl</button>
          <button onClick={() => retrieveAsset(props.poolInst, props.accounts[0], a.id)}>TAKE 1 FROM POOl</button>
        </div>
      </div>
    </div >
  );

  const ownedAssets = props.assets.filter((a: Asset) =>
    props.assetBalances[props.tokenids.indexOf(a.id)] > 0);

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <h2>Assets</h2>
        <Tabs>
          <div data-label="Home">
            <div style={{ color: 'white' }}>
              Granular Lending is a portal that lets you loan & borrow Sandbox NFT's.
            </div>
          </div>
          <div data-label="Your Items">
            <div className="card-container">
              {ownedAssets.map((a: Asset) =>
                AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)], props.assetBalancesPool[props.tokenids.indexOf(a.id)]))
              }
            </div>
          </div>
          <div data-label="Pool">
            <div className="card-container">
              {props.assets.map((a: Asset) =>
                AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)], props.assetBalancesPool[props.tokenids.indexOf(a.id)]))
              }
            </div>
          </div>
        </Tabs>

      </div>
    </div >
  );
};

export default Marketplace;
