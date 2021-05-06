import { Asset, Loan } from "../../App";
import sandIcon from "./assets/sandIcon.png";
import "./Marketplace.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

export interface PopupProps {
  a: Asset;
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

const returnAsset = (inst: any, from: string, index: string) => {
  inst.methods.returnLoan(index).send({ from: from }).then(console.log);
};

export const mappings: Record<string, string> = {
  "0": "Listed",
  "1": "Borrowed",
  "2": "Returned",
  "3": "Collected",
};

const YourBorrowsPage = (props: PopupProps) => {
  const currentLoans = props.loans.filter(
    (l: Loan) =>
      l.state === "1" &&
      l.borrower.toLowerCase() === props.accounts[0].toLowerCase()
  );
  const completeLoans = props.loans.filter(
    (l: Loan) =>
      l.state !== "1" &&
      l.borrower.toLowerCase() === props.accounts[0].toLowerCase()
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Your Current Borrows</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Item</TableCell>
              <TableCell style={{ color: "white" }}>Cost</TableCell>
              <TableCell style={{ color: "white" }}>Deposit</TableCell>
              <TableCell style={{ color: "white" }}>
                Duration (seconds)
              </TableCell>
              <TableCell style={{ color: "white" }}>Start date</TableCell>
              <TableCell style={{ color: "white" }}>Loaner</TableCell>
              <TableCell style={{ color: "white" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLoans.map((l: Loan) => {
              const asset = props.assets.find(
                (a: Asset) => a.id === l.asset_id
              );
              return (
                <TableRow key={l.cost}>
                  <TableCell style={{ color: "white" }}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 35 }}
                      src={
                        process.env.PUBLIC_URL +
                        `/equipment/${asset ? asset.image : ""}`
                      }
                    />
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.cost}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.deposit}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>{l.duration}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    {new Date(l.startTime * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>{l.loaner}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    {l.state === "1" ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          returnAsset(
                            props.poolInst,
                            props.accounts[0],
                            props.loans.indexOf(l).toString()
                          )
                        }
                      >
                        Return item
                        <ArrowForwardIosIcon />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Your Previous Borrows</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Item</TableCell>
              <TableCell style={{ color: "white" }}>Cost</TableCell>
              <TableCell style={{ color: "white" }}>Deposit</TableCell>
              <TableCell style={{ color: "white" }}>
                Duration (seconds)
              </TableCell>
              <TableCell style={{ color: "white" }}>Start date</TableCell>
              <TableCell style={{ color: "white" }}>Loaner</TableCell>
              <TableCell style={{ color: "white" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completeLoans.map((l: Loan) => {
              const asset = props.assets.find(
                (a: Asset) => a.id === l.asset_id
              );
              return (
                <TableRow key={l.cost}>
                  <TableCell style={{ color: "white" }}>
                    <img
                      alt="missing metadata"
                      style={{ objectFit: "contain", width: 35 }}
                      src={
                        process.env.PUBLIC_URL +
                        `/equipment/${asset ? asset.image : ""}`
                      }
                    />
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.cost}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <span>
                      <img
                        style={{ width: 15 }}
                        src={sandIcon}
                        alt="SAND logo"
                      />
                    </span>
                    {l.deposit}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>{l.duration}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    {new Date(l.startTime * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: "white" }}>{l.loaner}</TableCell>
                  <TableCell style={{ color: "white" }}>
                    {l.state === "1" ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          returnAsset(
                            props.poolInst,
                            props.accounts[0],
                            props.loans.indexOf(l).toString()
                          )
                        }
                      >
                        Return item
                        <ArrowForwardIosIcon />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default YourBorrowsPage;
