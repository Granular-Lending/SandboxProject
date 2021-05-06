import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export interface PopupProps {
  a: Asset;
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[]
}

const buyAsset = (inst: any, from: string, index: string) => {
  inst.methods.acceptLoan(index).send({ from: from }).then(console.log);
}

const AssetCard = (a: Asset, balance: number) => {
  return <div>
    <Link to="/assets">
      <Button variant='contained' style={{ margin: 8, fontSize: '1em' }}>
        <ArrowBackIosIcon />
        Back
      </Button>
    </Link>
    <div style={{ display: 'flex' }}>
      <img
        alt="missing metadata"
        style={{ objectFit: "contain", width: 250, padding: 20 }}
        src={process.env.PUBLIC_URL + `/equipment/${a.image}`}
      />
      <div>
        <h1>
          {a.name}
        </h1>
        <div style={{ padding: 8, borderStyle: 'solid', backgroundColor: '#1b2040' }}>
          <h3>{a.description}</h3>
          <h4>Type: {a.classification.type}</h4>
          <h4>Theme: {a.classification.theme}</h4>
          <h4>Categories: {a.classification.categories.join(", ")}</h4>
        </div>
      </div>
    </div>
  </div >
};

const AssetPage = (props: PopupProps) => {
  const loansToShow = props.loans.filter((l: Loan) => (l.asset_id === props.a.id && l.state === '0'));

  return <div >
    {AssetCard(props.a, props.assetBalances[props.tokenids.indexOf(props.a.id)])}
    <div style={{ backgroundColor: '#1b2030', paddingTop: 4 }}>
      <h2>Loans</h2>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>Item</TableCell>
              <TableCell style={{ color: 'white' }}>Cost</TableCell>
              <TableCell style={{ color: 'white' }}>Deposit</TableCell>
              <TableCell style={{ color: 'white' }}>Duration (seconds)</TableCell>
              <TableCell style={{ color: 'white' }}>Loaner</TableCell>
              <TableCell style={{ color: 'white' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loansToShow.map((l: Loan) =>
              <TableRow key={l.cost} >
                <TableCell style={{ color: 'white' }}>
                  <img
                    alt="missing metadata"
                    style={{ objectFit: "contain", width: 25 }}
                    src={process.env.PUBLIC_URL + `/equipment/${props.a.image}`}
                  />
                </TableCell>
                <TableCell style={{ color: 'white' }}>
                  <span>
                    <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                  </span>
                  {l.cost}
                </TableCell>
                <TableCell style={{ color: 'white' }} >
                  <span>
                    <img style={{ width: 15 }} src={sandIcon} alt="SAND logo" />
                  </span>
                  {l.deposit}
                </TableCell>
                <TableCell style={{ color: 'white' }}>{l.duration}</TableCell>
                <TableCell style={{ color: 'white' }}>{l.loaner}</TableCell>
                <TableCell style={{ color: 'white' }}>
                  <Button variant="contained" onClick={() => buyAsset(props.poolInst, props.accounts[0], props.loans.indexOf(l).toString())}>Borrow item<ArrowForwardIosIcon />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer></div>
  </div >
};

export default AssetPage;
