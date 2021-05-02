import React from "react";

import "./Hero.css";

import Sidebar from "../Sidebar/Sidebar";
import Marketplace from "../Marketplace/Marketplace";

const Hero = (props: any) => {
  return (
    <div className="Hero">
      <div className="hero-container">
        <Sidebar
          accounts={props.accounts}
          sym={props.sym}
          sandBalance={props.sandBalance}
          landBalance={props.landBalance}
          sandTokenInst={props.sandTokenInst}
          assetTokenInst={props.assetTokenInst}
        />
        <Marketplace
          accounts={props.accounts}
          assets={props.assets}
          assetBalances={props.assetBalances}
          assetBalancesPool={props.poolAssetBalances}
          assetTokenInst={props.assetTokenInst}
          poolInst={props.poolInst}
          tokenids={props.tokenids}
        />
      </div>
    </div>
  );
};

export default Hero;
