import React from 'react';

import "./Marketplace.css"

const Marketplace = (props) => {
    return ( 
        <div className="Marketplace">
            <div className="marketplace-container">
                <h2>Equipment Marketplace</h2>
                <div>
                {props.assets.map((a) => (
                <div style={{ margin: 20, borderStyle: "solid" }}>
                    <img
                        alt={"missing metadata"}
                        style={{ height: "50px" }}
                        src={process.env.PUBLIC_URL + `/equipment/${a.id}.png`}
                    />
                    <h3>
                        {a.name} | {a.classification.theme}
                    </h3>
                    <h4>
                        Token ID: {a.id.slice(0, 4)}...{a.id.slice(-2)}
                    </h4>
                    <p>You own {props.assetBalances[props.tokenids.indexOf(a.id)]}</p>
                </div>
                ))}
                </div>
            </div>
        </div>
     );
}
 
export default Marketplace;