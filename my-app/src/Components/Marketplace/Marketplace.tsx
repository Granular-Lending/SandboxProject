import React, { useState } from "react";
import Tabs from "../Tabs/Tabs";
import { Asset, Sale } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

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

const transferAsset = (inst: any, from: string, asset_id: string, price: number) => {
  inst.methods.createSale(asset_id, price).send({ from: from }).then(console.log).catch(console.error);
}

const retrieveAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptSale(index).send({ from: from }).then(console.log).catch(console.error);
}

const Marketplace = (props: MarketplaceProps) => {
  const [price, setPrice] = React.useState(5);

  const [m, setm] = useState(
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
    setm(a);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const [open2, setOpen2] = React.useState(false);
  const handleOpenBrowse = (a: Asset) => {
    setm(a);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const CreatePopup = (a: Asset) =>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create a sale</DialogTitle>
      <DialogContent>
        Selling 1 {a.name} for:
        <div style={{ display: 'flex' }}>
          <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
          <TextField
            autoFocus
            margin="dense"
            label="Price"
            fullWidth
            onChange={(e: any) => setPrice(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { transferAsset(props.poolInst, props.accounts[0], a.id, price); handleClose(); }} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>;

  const SalesPopup = (a: Asset) =>
    <Dialog open={open2} onClose={handleClose2} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Asset sales for {a.name}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.sales.map((l: Sale) => (l.asset_id === a.id && !l.sold ?
                <TableRow key={l.price}>
                  <TableCell >
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 20 }}
                      src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
                    />
                  </TableCell>
                  <TableCell >
                    <span>
                      <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                    </span>
                    {l.price}
                  </TableCell>
                  <TableCell >{l.seller}</TableCell>
                  <TableCell ><Button variant="contained" onClick={() => retrieveAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Buy</Button></TableCell>
                </TableRow> : null
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose2} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>;


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
              Create a sale
            </Button>
            <Button variant="contained" onClick={() => handleOpenBrowse(a)}>
              Browse sales
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
      {CreatePopup(m)}
      {SalesPopup(m)}
    </div>
  );
};

export default Marketplace;
