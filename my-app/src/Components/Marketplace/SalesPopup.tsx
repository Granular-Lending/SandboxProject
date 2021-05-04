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

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
}

const collectAsset = (inst: any, from: string, index: string) => {
  inst.methods.collectLoan(index).send({ from: from }).then(console.log);
}

const collectAssetFail = (inst: any, from: string, index: string) => {
  inst.methods.collectLoanFail(index).send({ from: from }).then(console.log);
}

const mappings: Record<number, string> = {
  0: "Listed",
  1: "Borrowed",
  2: "Returned",
  3: "Collected",
};

const SalesPopup = (props: PopupProps) => {
  const buttonMapping: Record<number, any> = {
    0: (l: Sale) => <Button variant="contained" onClick={() => buyAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Rent</Button>,
    1: (l: Sale) => <div><Button variant="contained" onClick={() => returnAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Return</Button ><Button variant="contained" onClick={() => collectAssetFail(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Time out</Button></div>,
    2: (l: Sale) => <Button variant="contained" onClick={() => collectAsset(props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>Collect</Button >,
    3: (l: Sale) => null
  }

  return <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Listings for {props.a.name}</DialogTitle>
    <DialogContent>
      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Start time</TableCell>
              <TableCell>Loaner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sales.map((l: Sale) => (l.asset_id === props.a.id ?
              <TableRow key={l.cost}>
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
                  {l.cost}
                </TableCell>
                <TableCell >
                  <span>
                    <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                  </span>
                  {l.deposit}
                </TableCell>
                <TableCell>{l.duration}</TableCell>
                <TableCell>{l.startTime}</TableCell>
                <TableCell>{l.seller.slice(0, 12)}...</TableCell>
                <TableCell>{mappings[l.sold]}</TableCell>
                <TableCell>
                  {buttonMapping[l.sold](l)}
                </TableCell>
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
  </Dialog >
};

export default SalesPopup;
