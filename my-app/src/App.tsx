import MetaMaskOnboarding from "@metamask/onboarding";
import React, { useState } from "react";
import Web3 from "web3";
import { BlockTransactionObject } from "web3-eth"

import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import Marketplace from "./Components/Marketplace/Marketplace";

const erc20abi = require("./abis/erc20.json");
const erc1155abi = require("./abis/erc1155.json");
const poolabi = require("./abis/pool.json");

const hexToDec = (s: string) => {
  var i, j, digits = [0], carry;
  for (i = 0; i < s.length; i += 1) {
    carry = parseInt(s.charAt(i), 16);
    for (j = 0; j < digits.length; j += 1) {
      digits[j] = digits[j] * 16 + carry;
      carry = digits[j] / 10 | 0;
      digits[j] %= 10;
    }
    while (carry > 0) {
      digits.push(carry % 10);
      carry = carry / 10 | 0;
    }
  }
  return digits.reverse().join('');
}

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
  entry: number;
  startTime: number;
  asset_id: string;
  loaner: string;
  borrower: string;
  state: string;
  tx: string;
  pendingFunction: string;
}

const EQUIPMENT_TOKEN_IDS = [
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

const ROPSTEN_ADDRESSES = ['0xFab46E002BbF0b4509813474841E0716E6730136', '0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8', '0xd9b047182124769c9d7fa129950038f0a2178890']
const MAINNET_ADDRESSES = ['0x3845badAde8e6dFF049820680d1F14bD3903a5d0', '0xa342f5D851E866E18ff98F351f2c6637f4478dB5', '0x0000000000000000000000000000000000000000']

declare global {
  interface Window {
    ethereum: any;
  }
}

const web3 = new Web3(window.ethereum);

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

const signatureToFunction: Record<string, string> = { '0xe6f97ea3': 'collect', '0xb9fae650': 'create', '0xe9126154': 'return', '0xafbb231e': 'timeout', '0xadfbe22f': 'accept' };

function App() {
  const [useRopsten, setUseRopsten] = useState(true);

  const [sandTokenInst, setSandTokenInst] = useState(new web3.eth.Contract(erc20abi, ""));
  const [assetTokenInst, setAssetTokenInst] = useState(new web3.eth.Contract(erc1155abi, ""));
  const [poolInst, setPoolTokenInst] = useState(new web3.eth.Contract(poolabi, ""));

  const [loginButtonText, setLoginButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([""]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sym, setSym] = useState("XXXX");
  const [sandBalance, setSandBalance] = useState(-1);
  const [sandApproved, setSandApproved] = useState(true);

  const [assetBalances, setAssetBalances]: [Record<string, number>, any] = useState({});

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

  const refreshLoans = (poolInstTemp: any, account: string) => {
    poolInstTemp.methods
      .getLoans()
      .call()
      .then(function (loansInfo: {
        costs: number[];
        deposits: number[];
        durations: number[];
        entrys: number[];
        startTimes: number[];
        ids: string[];
        loaners: string[];
        loanees: string[];
        states: number[];
      }) {
        const temp: Loan[] = [];
        for (let i = 0; i < loansInfo.costs.length; i++) {
          temp.push({
            cost: loansInfo.costs[i],
            deposit: loansInfo.deposits[i],
            duration: loansInfo.durations[i],
            entry: loansInfo.entrys[i],
            startTime: loansInfo.startTimes[i],
            loaner: loansInfo.loaners[i],
            borrower: loansInfo.loanees[i],
            asset_id: loansInfo.ids[i],
            state: loansInfo.states[i].toString(),
            tx: '',
            pendingFunction: ''
          });
        }
        web3.eth.getBlock("pending", true).then((value: BlockTransactionObject) => {
          for (let i = 0; i < value.transactions.length; i++) {
            const x = value.transactions[i];
            const pendingFunction = signatureToFunction[x.input.slice(0, 10)]
            if (x.to === poolInstTemp.options.address && !temp.some(el => el.tx === x.hash)) {
              if (pendingFunction === 'create' && x.from.toLowerCase() === account.toLowerCase()) {
                temp.push({
                  deposit: parseInt(`0x${x.input.slice(-128, -64)}`, 16),
                  cost: parseInt(`0x${x.input.slice(-192, -128)}`, 16),
                  duration: parseInt(`0x${x.input.slice(-64)}`, 16),
                  entry: 0,
                  startTime: 0,
                  loaner: account,
                  borrower: '0x0000000000000000000000000000000000000000',
                  asset_id: hexToDec(x.input.slice(9, 74)),
                  state: '0',
                  tx: x.hash,
                  pendingFunction: pendingFunction
                });
              } else {
                temp[parseInt(x.input.slice(-64), 16)].tx = x.hash;
                temp[parseInt(x.input.slice(-64), 16)].pendingFunction = pendingFunction
              }
            }
          }
          setLoans(temp);
        });
      });
  }

  React.useEffect(() => {
    const loadMetadataFromIPFS = (index: number, ipfsAddress: string) => {
      const tempy = assets;
      let url = `https://ipfs.io/ipfs/${ipfsAddress.slice(7)}`;

      fetch(url)
        .then(res => res.json())
        .then((metadata: any) => {
          metadata.image = metadata.image.slice(6);
          metadata.animation_url = metadata.animation_url.slice(6);
          tempy[index] = {
            id: EQUIPMENT_TOKEN_IDS[index],
            ...metadata,
          };
          setAssets(tempy);
        })
    }

    function handleNewAccounts(newAccounts: string[]) {
      setAccounts(newAccounts);

      web3.eth.net.getNetworkType().then((networkType: string) => {
        const is_ropsten = networkType === 'ropsten';
        setUseRopsten(is_ropsten);
        let sandAddy = MAINNET_ADDRESSES[0];
        let assetAddy = MAINNET_ADDRESSES[1];
        let poolAddy = MAINNET_ADDRESSES[2];
        if (is_ropsten) {
          sandAddy = ROPSTEN_ADDRESSES[0];
          assetAddy = ROPSTEN_ADDRESSES[1];
          poolAddy = ROPSTEN_ADDRESSES[2];
        }

        const sandTokenInstTemp = new web3.eth.Contract(erc20abi, sandAddy);
        const assetTokenInstTemp = new web3.eth.Contract(erc1155abi, assetAddy);
        const poolInstTemp = new web3.eth.Contract(poolabi, poolAddy);

        setSandTokenInst(sandTokenInstTemp);
        setAssetTokenInst(assetTokenInstTemp);
        setPoolTokenInst(poolInstTemp);

        sandTokenInstTemp.methods
          .symbol()
          .call()
          .then(function (s: string) {
            setSym(s);
          });
        sandTokenInstTemp.methods
          .balanceOf(newAccounts[0])
          .call()
          .then(function (bal: number) {
            setSandBalance(bal);
          });
        sandTokenInstTemp.methods
          .allowance(newAccounts[0], poolAddy)
          .call()
          .then((s: number) => setSandApproved(s > 0))

        assetTokenInstTemp.methods
          .balanceOfBatch(
            Array(EQUIPMENT_TOKEN_IDS.length).fill(newAccounts[0]),
            EQUIPMENT_TOKEN_IDS
          )
          .call()
          .then(function (bals: number[]) {
            const balancesCopy = assetBalances;
            for (let i = 0; i < bals.length; i++) {
              balancesCopy[EQUIPMENT_TOKEN_IDS[i]] = bals[i]
            }
            setAssetBalances(balancesCopy);
          });
        assetTokenInstTemp.methods
          .isApprovedForAll(newAccounts[0], poolAddy)
          .call()
          .then((s: boolean) => setAssetsApproved(s))

        if (is_ropsten) {
          refreshLoans(poolInstTemp, newAccounts[0]);
          for (let i = 0; i < EQUIPMENT_TOKEN_IDS.length; i++) {
            loadMetadataFromIPFS(i, TEST_URIS[i]);
          }
        } else {
          for (let i = 0; i < EQUIPMENT_TOKEN_IDS.length; i++) {
            assetTokenInstTemp.methods
              .uri(EQUIPMENT_TOKEN_IDS[i])
              .call()
              .then(function (uri: string) {
                loadMetadataFromIPFS(i, uri);
              });
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
  }, [assets, assetBalances]);

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
        open={!useRopsten}
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
        accounts={accounts}
      />
      <Marketplace
        addPendingLoans={refreshLoans}
        assetsApproved={assetsApproved}
        sandApproved={sandApproved}
        accounts={accounts}
        sym={sym}
        sandBalance={sandBalance}
        assets={assets}
        assetBalances={assetBalances}
        assetTokenInst={assetTokenInst}
        poolInst={poolInst}
        sandTokenInst={sandTokenInst}
        loans={loans}
      />
    </Router >
  );
}

export default App;
