import React, { useState } from "react";
import Tabs from "../Tabs/Tabs";
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
        alt={"missing image metadata"}
        style={{ objectFit: "contain" }}
        src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
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

  // const onClick = () => {
  //   setAssetsToShow(
  //     props.assets.map((a: Asset) =>
  //       showOwned || props.assetBalances[props.tokenids.indexOf(a.id)] > 0 ? (
  //         AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
  //       ) : (
  //         <></>
  //       )
  //     )
  //   );

  //   setShowOwned(!showOwned);
  // };

  const poolAssets = props.assets.map((a: Asset) =>
    AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
  );

  const ownedAssets = props.assets.map((a: Asset) =>
    showOwned || props.assetBalances[props.tokenids.indexOf(a.id)] > 0 ? (
      AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)])
    ) : (
      <></>
    )
  );

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <h2>Assets</h2>
        <Tabs>
          <div data-label="Home"> 
            <div style={{color: 'white'}}>
            Granular Lending is a portal that lets you loan & borrow Sandbox NFT's.
            </div>
          </div> 
          <div data-label="Your Items"> 
            <div className="card-container">
              {ownedAssets}
            </div>
          </div> 
          <div data-label="Pool"> 
            <div className="card-container">
              {poolAssets}
            </div>
          </div> 
        </Tabs>
        
      </div>
    </div >
  );
};

export default Marketplace;
