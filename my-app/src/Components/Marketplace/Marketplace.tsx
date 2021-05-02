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
  poolInst: any;
  loaners: string[];
}

const transferAsset = (inst: any, from: string, id: string) => {
  inst.methods.putIntoPool(id).send({ from: from }).then(console.log).catch(console.error);
}

const retrieveAsset = (inst: any, from: string, id: string) => {
  inst.methods.retrieve(id, "0xb19BC46C52A1352A071fe2389503B6FE1ABD50Ff").send({ from: from }).then(console.log).catch(console.error);
}

const Marketplace = (props: MarketplaceProps) => {
  const AssetCard = (a: Asset, balance: number, balancePool: number) => (
    <div className="productCard">
      <div className="card-container-data">
        <img
          alt="missing metadata"
          style={{ objectFit: "contain" }}
          src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
        />
        <div className="cardData">
          <h3>
            {a.name}
          </h3>
          <h4>{a.classification.theme} | ID: {a.id.slice(0, 10)}... </h4>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id={`${a.name}Heading`}>
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#${a.name.split(/\s/).join('').slice(0, 7)}`} aria-expanded="true" aria-controls={`${a.name.split(/\s/).join('').slice(0, 7)}`}>
                  More Info
              </button>
              </h2>
              <div id={`${a.name.split(/\s/).join('').slice(0, 7)}`} className="accordion-collapse collapse show" aria-labelledby={`${a.name}Heading`} data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <p>You own {balance}</p>
                  <p>Pool owns {balancePool}</p>
                  <button className="first-btn" onClick={() => transferAsset(props.poolInst, props.accounts[0], a.id)}>PUT 1 IN POOl</button>
                  <button className="second-btn" onClick={() => retrieveAsset(props.poolInst, props.accounts[0], a.id)}>TAKE 1 OUT OF POOl</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );

  const ownedAssets = props.assets.filter((a: Asset) => props.assetBalances[props.tokenids.indexOf(a.id)] > 0);

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
