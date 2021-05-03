import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { PopupProps } from "./SalesPopup";


interface CreateProps extends PopupProps {
  price: number;
  setPrice: any;
}

const transferAsset = (inst: any, from: string, asset_id: string, price: number) => {
  inst.methods.createSale(asset_id, price).send({ from: from }).then(console.log);
}

const CreatePopup = (props: CreateProps) =>
  <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Create a sale</DialogTitle>
    <DialogContent>
      Selling 1 {props.a.name} for:
    <div style={{ display: 'flex' }}>
        <img style={{ objectFit: "contain", width: 20 }} src={sandIcon} alt="SAND logo" />
        <TextField
          autoFocus
          margin="dense"
          label="Price"
          fullWidth
          onChange={(e: any) => props.setPrice(e.target.value)}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleClose} color="primary">
        Cancel
    </Button>
      <Button onClick={() => {
        transferAsset(props.poolInst, props.accounts[0], props.a.id, props.price);
        props.handleClose();
      }} color="primary">
        Create
    </Button>
    </DialogActions>
  </Dialog>;

export default CreatePopup;
