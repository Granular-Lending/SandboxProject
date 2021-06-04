import MetaMaskOnboarding from "@metamask/onboarding";
import React, { useState } from "react";
import Web3 from "web3";

import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import Marketplace from "./Components/Marketplace/Marketplace";

const erc20abi = require("./abis/erc20.json");
const erc1155abi = require("./abis/erc1155.json");
const poolabi = require("./abis/pool.json");

export interface Asset {
  id: string;
  name: string;
  description: string;
  image: string;
  animation_url: string;
  creator_profile_url: string;
  sandbox: {
    creator: string;
    classification: { type: string; theme: string; categories: string[] }
  };
}

export interface Loan {
  cost: number;
  deposit: number;
  duration: number;
  startTime: number;
  asset_id: string;
  loaner: string;
  borrower: string;
  state: string;
}

export const EQUIPMENT_TOKEN_IDS = [
  "26059276970032186212506257052788207833935590993847855924189730778752558827520",
  "40785833732304342849735419653626615027421227776496020677721887159020450484224",
  "40785833732304342849735419653626615027421227776496020677721887159020450484225",
  "55464657044963196816950587289035428064568320970692304673817341489687673452544",
  "59877022449356993441109123519648614159160891474231538650442489089192695443456",
  "64946128963576652222538036970165700352413276268630562676894999040163055677440",
  "64946128963576652222538036970165700352413276268630562676894999040163055677441",
  "64946128963576652222538036970165700352413276268630562676894999040163055677442",
  "64946128963576652222538036970165700352413276268630562676894999040163055677443",
  "64946128963576652222538036970165700352413276268630562676894999040163055677444",
  "64946128963576652222538036970165700352413276268630562676894999040163055677445",
  "55464657044963196816950587289035428064568320970692304673817341489687715414016",
  "55464657044963196816950587289035428064568320970692304673817341489687715414017",
  "55464657044963196816950587289035428064568320970692304673817341489687715414018",
  "55464657044963196816950587289035428064568320970692304673817341489687715414019",
  "55464657044963196816950587289035428064568320970692304673817341489687715414020",
];

const TEST_URIS = [
  "ipfs://bafybeib6jgupsp26uywcc4psuqie3w646za4dmpbzdxdi56enhlnztvcyu/0.json",
  "ipfs://bafybeicevfqqfobqdc3lr62xqyx5utvozyqsq5ok2bswy4tblzfeeerkle/0.json",
  "ipfs://bafybeicevfqqfobqdc3lr62xqyx5utvozyqsq5ok2bswy4tblzfeeerkle/1.json",
  "ipfs://bafybeihfloegzon52utqqqhvfedhmdqxjdy7bbpez5pk2nwbc4gomf2pge/0.json",
  "ipfs://bafybeifyldllf63l7ppdppmchgnnj7umh6nx6smhnzhmiiskyckc5zetre/0.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/0.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/1.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/2.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/3.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/4.json",
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/5.json",
  "ipfs://bafybeigara7fm7m2spckk4kvtd3ru7g645gjlbn6pbe3lej3fhipngm5ou/0.json",
  "ipfs://bafybeigara7fm7m2spckk4kvtd3ru7g645gjlbn6pbe3lej3fhipngm5ou/1.json",
  "ipfs://bafybeigara7fm7m2spckk4kvtd3ru7g645gjlbn6pbe3lej3fhipngm5ou/2.json",
  "ipfs://bafybeigara7fm7m2spckk4kvtd3ru7g645gjlbn6pbe3lej3fhipngm5ou/3.json",
  "ipfs://bafybeigara7fm7m2spckk4kvtd3ru7g645gjlbn6pbe3lej3fhipngm5ou/4.json",
];

declare global {
  interface Window {
    ethereum: any;
  }
}

const web3 = new Web3(window.ethereum);

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

function App() {
  const [useMain, setUseMain] = useState(false);

  const [sandTokenAddress, setSandTokenAddress] = useState("");
  const [assetTokenAddress, setAssetTokenAddress] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  const [sandTokenInst, setSandTokenInst] = useState(new web3.eth.Contract(erc20abi, sandTokenAddress));
  const [assetTokenInst, setAssetTokenInst] = useState(new web3.eth.Contract(erc1155abi, assetTokenAddress));
  const [poolInst, setPoolTokenInst] = useState(new web3.eth.Contract(poolabi, poolAddress));

  const [sym, setSym] = useState("XXXX");

  const [loginButtonText, setLoginButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([""]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sandBalance, setSandBalance] = useState(-1);
  const [assetBalances, setAssetBalances] = useState(
    Array(EQUIPMENT_TOKEN_IDS.length).fill(-1)
  );
  const [sandApproved, setSandApproved] = useState(true);
  const [assetsApproved, setAssetsApproved] = useState(true);

  const [loans, setLoans]: [Loan[], any] = useState([]);

  const [assets, setAssets]: [Asset[], any] = useState(
    EQUIPMENT_TOKEN_IDS.map((id: string) => {
      return {
        id: id,
        name: "missing metadata",
        description: "missing metadata",
        image: "missing metadata",
        animation_url: "missing metadata",
        creator_profile_url: "missing metadata",
        sandbox: {
          creator: "missing metadata",
          classification: {
            type: "missing metadata",
            theme: "missing metadata",
            categories: [""],
          }
        },
      };
    })
  );

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setLoginButtonText(CONNECTED_TEXT);
      setDisabled(true);
      if (onboarding.current) {
        onboarding.current.stopOnboarding();
      }
    } else {
      setLoginButtonText(CONNECT_TEXT);
      setDisabled(false);
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts: string[]) {
      setAccounts(newAccounts);
      web3.eth.net.getNetworkType().then((networkType: string) => {
        const is_ropsten = networkType === 'ropsten';
        setUseMain(!is_ropsten);
        let sandAddy = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
        let assetAddy = '0xa342f5D851E866E18ff98F351f2c6637f4478dB5';
        let poolAddy = '0x0000000000000000000000000000000000000000';
        if (is_ropsten) {
          sandAddy = '0xFab46E002BbF0b4509813474841E0716E6730136';
          assetAddy = '0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8';
          poolAddy = '0x0b054D0FfA0477323da4BC5e1f31a95A6f14bA9F';
        }
        const sandTokenInstHi = new web3.eth.Contract(erc20abi, sandAddy);
        const assetTokenInstHi = new web3.eth.Contract(erc1155abi, assetAddy);
        const poolInstHi = new web3.eth.Contract(poolabi, poolAddy);
        setSandTokenAddress(sandAddy);
        setAssetTokenAddress(assetAddy);
        setPoolAddress(poolAddy);
        setSandTokenInst(sandTokenInstHi);
        setAssetTokenInst(assetTokenInstHi);
        setPoolTokenInst(poolInstHi);
        sandTokenInstHi.methods
          .symbol()
          .call()
          .then(function (s: string) {
            setSym(s);
          });
        sandTokenInstHi.methods
          .balanceOf(newAccounts[0])
          .call()
          .then(function (bal: number) {
            setSandBalance(bal);
          });
        assetTokenInstHi.methods
          .balanceOfBatch(
            Array(EQUIPMENT_TOKEN_IDS.length).fill(newAccounts[0]),
            EQUIPMENT_TOKEN_IDS
          )
          .call()
          .then(function (bals: number[]) {
            setAssetBalances(bals);
          });

        sandTokenInstHi.methods
          .allowance(newAccounts[0], poolAddy)
          .call()
          .then((s: number) => setSandApproved(s > 0))
        assetTokenInstHi.methods
          .isApprovedForAll(newAccounts[0], poolAddy)
          .call()
          .then((s: boolean) => setAssetsApproved(s))

        poolInstHi.methods
          .getLoans()
          .call()
          .then(function (salesInfo: {
            costs: number[];
            deposits: number[];
            durations: number[];
            startTimes: number[];
            ids: string[];
            loaners: string[];
            loanees: string[];
            states: number[];
          }) {
            const temp: Loan[] = [];
            for (let i = 0; i < salesInfo.costs.length; i++) {
              if (
                salesInfo.loaners[i] ===
                "0x0000000000000000000000000000000000000000"
              ) break;

              temp.push({
                cost: salesInfo.costs[i],
                deposit: salesInfo.deposits[i],
                duration: salesInfo.durations[i],
                startTime: salesInfo.startTimes[i],
                loaner: salesInfo.loaners[i],
                borrower: salesInfo.loanees[i],
                asset_id: salesInfo.ids[i],
                state: salesInfo.states[i].toString(),
              });
            }
            setLoans(temp);
          });

        for (let i = 0; i < EQUIPMENT_TOKEN_IDS.length; i++) {
          const tempy = assets;
          let metadata = {
            name: "missing metadata",
            description: "missing metadata",
            image: "missing metadata",
            creator_profile_url: "missing metadata",
            animation_url: "missing metadata",
            sandbox: {
              creator: "missing metadata",
              classification: {
                type: "missing metadata",
                theme: "missing metadata",
                categories: [""],
              }
            },
          };
          if (useMain) {
            assetTokenInstHi.methods
              .uri(EQUIPMENT_TOKEN_IDS[i])
              .call()
              .then(function (u: string) {
                try {
                  metadata = require(`./metadata/${u.slice(7)}`);
                } catch {
                };
                setAssets(tempy);
              });
          } else {
            try {
              metadata = require(`./metadata/${TEST_URIS[i].slice(7)}`);
            } catch {
            }
            tempy[i] = {
              id: EQUIPMENT_TOKEN_IDS[i],
              ...metadata,
              image: metadata.image.slice(6),
              animation_url: metadata.animation_url.slice(6),
            };
          }
        }
      });
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.off("accountsChanged", handleNewAccounts);
      };
    }
  }, [assets, useMain]);

  const metaMaskLogin = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: React.SetStateAction<string[]>) => {
          setAccounts(newAccounts);
        }
        );
    } else {
      if (onboarding.current) {
        onboarding.current.startOnboarding();
      }
    }
  };

  return (
    <Router>
      <Dialog
        open={useMain}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Wrong network"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This project is currently in beta - please switch to the Ropsten testnet and refresh the page.
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Navbar
        disabled={isDisabled}
        onClick={metaMaskLogin}
        loginButtonText={loginButtonText}
        sandBalance={sandBalance}
      />
      <Marketplace
        assetsApproved={assetsApproved}
        sandAllowance={sandApproved}
        poolAddress={poolAddress}
        accounts={accounts}
        sym={sym}
        sandBalance={sandBalance}
        assets={assets}
        assetBalances={assetBalances}
        assetTokenInst={assetTokenInst}
        poolInst={poolInst}
        tokenids={EQUIPMENT_TOKEN_IDS}
        sandTokenInst={sandTokenInst}
        loans={loans}
      />
    </Router >
  );
}

export default App;
