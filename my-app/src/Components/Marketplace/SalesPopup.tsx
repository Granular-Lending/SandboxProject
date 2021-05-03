import { Asset, Sale } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

export interface PopupProps {
  a: Asset;
  poolInst: any;
  accounts: string[];
  sales: Sale[];
  open: any;
  handleClose: any;
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptSale(index).send({ from: from }).then(console.log);
}

const SalesPopup = (props: PopupProps) =>
  <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Asset sales for {props.a.name}</DialogTitle>
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
            {props.sales.map((l: Sale) => (l.asset_id === props.a.id && !l.sold ?
              <TableRow key={l.price}>
                <TableCell >
                  <img
                    alt="missing metadata"
                    style={{ objectFit: "contain", width: 20 }}
                    src={process.env.PUBLIC_URL + `/equipment/${props.a.image}`}
                  />
                </TableCell>
                <TableCell >
                  <span>
                    <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                  </span>
                  {l.price}
                </TableCell>
                <TableCell >{l.seller}</TableCell>
                <TableCell ><Button variant="contained" onClick={() => buyAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Buy</Button></TableCell>
              </TableRow> : null
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleClose} color="primary">
        Cancel
    </Button>
    </DialogActions>
  </Dialog>;

export default SalesPopup;
