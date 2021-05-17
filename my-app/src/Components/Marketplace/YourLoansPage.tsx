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
import { NavLink } from "react-router-dom";
import { mappings } from "./YourBorrowsPage";

export interface PopupProps {
  poolInst: any;
  accounts: string[];
  loans: Loan[];
  assetBalances: number[];
  tokenids: string[];
  assets: Asset[];
}

const collectAsset = (inst: any, from: string, index: string) => {
  inst.methods.collectLoan(index).send({ from: from }).then(console.log);
};

const collectAssetFail = (inst: any, from: string, index: string) => {
  inst.methods.collectLoanFail(index).send({ from: from }).then(console.log);
};

const YourLoansPage = (props: PopupProps) => {
  const loansToShow = props.loans.filter(
    (l: Loan) => l.loaner.toLowerCase() === props.accounts[0].toLowerCase()
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Your Current Loans</h2>
      <NavLink style={{ textDecoration: "none" }} to="/createLoan">
        <Button variant="contained">Create a loan</Button>
      </NavLink>
      <TableContainer style={{ backgroundColor: "#1b2030" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Item</TableCell>
              <TableCell style={{ color: "white" }}>Cost</TableCell>
              <TableCell style={{ color: "white" }}>Deposit</TableCell>
              <TableCell style={{ color: "white" }}>
                Duration (seconds)
              </TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}>Borrower</TableCell>
              <TableCell style={{ color: "white" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loansToShow
              .filter((l: Loan) => l.state !== "3")
              .map((l: Loan) => {
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
                    <TableCell style={{ color: "white" }}>
                      {l.duration}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      {mappings[l.state]}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      {l.borrower ===
                        "0x0000000000000000000000000000000000000000"
                        ? "None"
                        : l.borrower}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      {l.state === "2" ? (
                        <Button
                          variant="contained"
                          onClick={() =>
                            collectAsset(
                              props.poolInst,
                              props.accounts[0],
                              props.loans.indexOf(l).toString()
                            )
                          }
                        >
                          Collect item
                          <ArrowForwardIosIcon />
                        </Button>
                      ) : null}
                      {l.state === "1" &&
                        Date.now() > l.startTime + l.duration ? (
                        <Button
                          variant="contained"
                          onClick={() =>
                            collectAssetFail(
                              props.poolInst,
                              props.accounts[0],
                              props.loans.indexOf(l).toString()
                            )
                          }
                        >
                          Timeout
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

      <h2>Your Previous Loans</h2>
      <TableContainer style={{ backgroundColor: "#1b2030" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Item</TableCell>
              <TableCell style={{ color: "white" }}>Cost</TableCell>
              <TableCell style={{ color: "white" }}>Deposit</TableCell>
              <TableCell style={{ color: "white" }}>
                Duration (seconds)
              </TableCell>
              <TableCell style={{ color: "white" }}>Status</TableCell>
              <TableCell style={{ color: "white" }}>Borrower</TableCell>
              <TableCell style={{ color: "white" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loansToShow
              .filter((l: Loan) => l.state === "3")
              .map((l: Loan) => {
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
                    <TableCell style={{ color: "white" }}>
                      {l.duration}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      {mappings[l.state]}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      {l.borrower}
                    </TableCell>
                    <TableCell style={{ color: "white" }}></TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default YourLoansPage;
