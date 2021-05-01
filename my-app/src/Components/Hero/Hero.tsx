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
          sandBalance={props.sandBalance}
          landBalance={props.landBalance}
          sandTokenInst={props.sandTokenInst}
        />
        <Marketplace
          accounts={props.accounts}
          assets={props.assets}
          assetBalances={props.assetBalances}
          assetTokenInst={props.assetTokenInst}
          tokenids={props.tokenids}
        />
      </div>
    </div>
  );
};

export default Hero;
