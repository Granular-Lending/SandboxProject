import React from 'react';

import "./Hero.css"

import Sidebar from "../Sidebar/Sidebar";
import Marketplace from "../Marketplace/Marketplace";


const Hero = (props) => {
    return ( 
        <div className="Hero">
            <div className="hero-container">
                <Sidebar accounts={props.accounts} sandBalance={props.sandBalance} landBalance={props.landBalance}/>
                <Marketplace assets={props.assets} assetBalances={props.assetBalances} tokenids={props.tokenids}/>
            </div>
        </div>
     );
}
 
export default Hero;