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

const mappingsFunction: Record<number, any> = {
  0: buyAsset,
  1: returnAsset,
  2: collectAsset,
  3: () => null,
};

const mappingsT: Record<number, string> = {
  0: "Rent",
  1: "Return",
  2: "Collect",
  3: "",
};


const mappingsFailFunction: Record<number, any> = {
  0: () => null,
  1: collectAssetFail,
  2: () => null,
  3: () => null,
};

const mappingsFail: Record<number, string> = {
  0: "",
  1: "Timeout",
  2: "",
  3: "",
};

const SalesPopup = (props: PopupProps) =>
  <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Listings for {props.a.name}</DialogTitle>
    <DialogContent>
      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sales.map((l: Sale) => (l.asset_id === props.a.id ?
              <TableRow key={l.upfront}>
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
                  {l.upfront}
                </TableCell>
                <TableCell >
                  <span>
                    <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                  </span>
                  {l.getback}
                </TableCell>
                <TableCell>{l.seller.slice(0, 12)}...</TableCell>
                <TableCell>{mappings[l.sold]}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => mappingsFunction[l.sold](props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>{mappingsT[l.sold]}</Button>
                  <Button variant="contained" onClick={() => mappingsFailFunction[l.sold](props.poolInst, props.accounts[0], props.sales.indexOf(l).toString())}>{mappingsFail[l.sold]}</Button>
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
  </Dialog >;

export default SalesPopup;
