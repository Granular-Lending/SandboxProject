import React, { useState } from "react";
import Tabs from "../Tabs/Tabs";
import { Asset, Sale } from "../../App";
import SalesPopup from "./SalesPopup";
import CreatePopup from "./CreatePopup";
import "./Marketplace.css";
import { Button } from "@material-ui/core";

interface MarketplaceProps {
  assets: Asset[];
  assetBalances: number[];
  assetBalancesPool: number[]
  tokenids: string[];
  accounts: string[];
  assetTokenInst: any;
  poolInst: any;
  sales: Sale[];
}

const Marketplace = (props: MarketplaceProps) => {
  const [chosenAsset, setChosenAsset] = useState(
    {
      id: "-1",
      name: "missing metadata",
      image: "",
      classification: {
        type: "missing metadata",
        theme: "missing metadata",
        categories: [""],
      },
    }
  );

  const [open, setOpen] = React.useState(false);
  const handleOpenCreate = (a: Asset) => {
    setChosenAsset(a);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = React.useState(false);
  const handleOpenBrowse = (a: Asset) => {
    setChosenAsset(a);
    setOpen2(true);
  };
  const handleCloseBrowse = () => {
    setOpen2(false);
  };

  const AssetCard = (a: Asset, balance: number) => {
    return <div className="productCard">
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
          <h4>{a.classification.type} | {a.classification.theme}</h4>

          <p>You own {balance}</p>
          <div style={{ display: "flex" }}>
            <Button variant="contained" onClick={() => handleOpenCreate(a)}>
              Create a listing
            </Button>
            <Button variant="contained" onClick={() => handleOpenBrowse(a)}>
              Browse listings
            </Button>
          </div>
        </div>
      </div>
    </div >
  };

  const ownedAssets = props.assets.filter((a: Asset) => props.assetBalances[props.tokenids.indexOf(a.id)] > 0);

  return (
    <div className="Marketplace">
      <div className="marketplace-container">
        <Tabs>
          <div data-label="Home">
            <div style={{ color: 'white' }}>
              Granular Lending is a portal that lets you loan & borrow Sandbox NFT's.
            </div>
          </div>
          <div data-label="Your Items">
            <div className="card-container">
              {ownedAssets.map((a: Asset) =>
                AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)]))
              }
            </div>
          </div>
          <div data-label="Pool">
            <div className="card-container">
              {props.assets.map((a: Asset) =>
                AssetCard(a, props.assetBalances[props.tokenids.indexOf(a.id)]))
              }
            </div>
          </div>
        </Tabs>
      </div>
      <CreatePopup open={open} handleClose={handleClose} sales={props.sales} poolInst={props.poolInst} accounts={props.accounts} a={chosenAsset} />
      <SalesPopup open={open2} handleClose={handleCloseBrowse} sales={props.sales} poolInst={props.poolInst} accounts={props.accounts} a={chosenAsset} />
    </div>
  );
};

export default Marketplace;
