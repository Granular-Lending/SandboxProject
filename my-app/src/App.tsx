import MetaMaskOnboarding from "@metamask/onboarding";
import React, { useState } from "react";
import Web3 from "web3";
import { BlockTransactionObject } from "web3-eth"

import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import Marketplace, { DeNationsAssetCard, SandboxAssetCard, DecentralandAssetCard, SandboxMarketplace, DecentralandMarketplace, DeNationsMarketplace } from "./Components/Marketplace/Marketplace";

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

export interface NFT {
  id: string;
  verse: string;
  balance: number;
  metadata: any;
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

export class Verse {
  name: string;
  nftIds: string[];
  getMetadata: (uri: string) => Promise<any>;
  uriFunction: (id: string) => any;
  contractInst: any;
  card: (a: NFT, loans: Loan[]) => JSX.Element;
  marketplace: any;

  constructor(
    name: string,
    nftIds: string[],
    getMetadata: (uri: string) => Promise<any>,
    uriFunction: (id: string) => any,
    address: string,
    card: (a: NFT, loans: Loan[]) => JSX.Element,
    marketplaceColor: any,
  ) {
    this.name = name;
    this.nftIds = nftIds;
    this.getMetadata = getMetadata;
    this.uriFunction = uriFunction;
    this.contractInst = new web3.eth.Contract(erc1155abi, address);
    this.card = card;
    this.marketplace = marketplaceColor;
  }
}

const ERC20_MAINNET = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';

const ERC20_ROPSTEN = '0xFab46E002BbF0b4509813474841E0716E6730136';
const POOL_ROPSTEN = '0xd9b047182124769c9d7fa129950038f0a2178890';

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

const verses: Verse[] = [
  new Verse('Sandbox',
    [
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
      "55464657044963196816950587289035428064568320970692304673817341489687715414021",
    ],
    async (uri: string): Promise<any> => {
      let url = `https://ipfs.io/ipfs/${uri.slice(7)}`;

      return await fetch(url)
        .then(res => res.json())
        .then((metadata: any) => {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.slice(6)}`;
          metadata.animation_url = `https://ipfs.io/ipfs/${metadata.animation_url.slice(6)}`;
          return metadata;
        });
    },
    new web3.eth.Contract(erc1155abi, '0xa342f5d851e866e18ff98f351f2c6637f4478db5').methods.uri,
    '0xa342f5d851e866e18ff98f351f2c6637f4478db5',
    SandboxAssetCard,
    SandboxMarketplace,
  ),
  new Verse('Decentraland',
    [
      "599",
      "28757",
    ],
    async (uri: string): Promise<any> => {
      return await fetch(uri)
        .then(res => res.json())
        .then((metadata: any) => {
          delete metadata.id;
          return metadata;
        });
    },
    new web3.eth.Contract(erc1155abi, '0xD35147BE6401dcb20811f2104c33dE8E97ED6818').methods.tokenURI,
    '0xD35147BE6401dcb20811f2104c33dE8E97ED6818',
    DecentralandAssetCard,
    DecentralandMarketplace
  ),
  new Verse('DeNations',
    [
      "22",
      "15"
    ],
    async (uri: string): Promise<any> => {
      return await fetch(uri)
        .then(res => res.json())
        .then((metadata: any) => {
          return metadata;
        });
    },
    new web3.eth.Contract(erc1155abi, '0xA9Cfc59a96EaF67f8E1b8BC494d3863863C1F8ED').methods.uri,
    '0xA9Cfc59a96EaF67f8E1b8BC494d3863863C1F8ED',
    DeNationsAssetCard,
    DeNationsMarketplace
  ),
]

function App() {
  const [sandTokenInst, setSandTokenInst] = useState(new web3.eth.Contract(erc20abi, ""));
  const [poolInst, setPoolTokenInst] = useState(new web3.eth.Contract(poolabi, ""));

  const [loginButtonText, setLoginButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([""]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sym, setSym] = useState("XXXX");
  const [sandBalance, setSandBalance] = useState(-1);
  const [sandApproved, setSandApproved] = useState(true);

  const [sandboxAssetsApproved, setAssetsApproved] = useState(true);
  const [dclAssetsApproved, setDclAssetsApproved] = useState(true);

  const [loans, setLoans]: [Loan[], any] = useState([]);
  const [nfts, setAssets]: [NFT[], any] = useState(
    verses.map((v: Verse) => v.nftIds.map((id: string) => {
      return {
        id: id,
        verse: v.name,
        balance: 0,
        metadata: {
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
        }
      };
    })).flat()
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
                  deposit: parseInt(`0x${x.input.slice(-128, -64)} `, 16),
                  cost: parseInt(`0x${x.input.slice(-192, -128)} `, 16),
                  duration: parseInt(`0x${x.input.slice(-64)} `, 16),
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
    function handleNewAccounts(newAccounts: string[]) {
      setAccounts(newAccounts);

      web3.eth.net.getNetworkType().then((networkType: string) => {
        const is_ropsten = networkType === 'ropsten';

        let sandAddy;
        let poolAddy: string;
        if (is_ropsten) {
          sandAddy = ERC20_ROPSTEN;
          poolAddy = POOL_ROPSTEN;
        } else {
          sandAddy = ERC20_MAINNET;
          poolAddy = POOL_ROPSTEN;

        }

        const sandTokenInstTemp = new web3.eth.Contract(erc20abi, sandAddy);
        const poolInstTemp = new web3.eth.Contract(poolabi, poolAddy);

        setSandTokenInst(sandTokenInstTemp);
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

        refreshLoans(poolInstTemp, newAccounts[0]);

        // todo this should really loop through assets?
        verses.map((v: Verse) => {
          v.nftIds.map((id: string) => {
            v.uriFunction(id)
              .call()
              .then((uri: string) =>
                v.getMetadata(uri).then((metadata: any) => {
                  const tempy = nfts;
                  tempy[nfts.findIndex((x: NFT) => x.id === id)].metadata = metadata;
                  setAssets(tempy);
                })
              );
            return null;
          })

          v.contractInst.methods
            .balanceOfBatch(
              Array(v.nftIds.length).fill(newAccounts[0]),
              v.nftIds
            )
            .call()
            .then(function (bals: number[]) {
              const tempy = nfts;
              for (let i = 0; i < bals.length; i++) {
                tempy[nfts.findIndex((x: NFT) => x.id === v.nftIds[i])].balance = bals[i];
              }
              setAssets(tempy)
            });

          const hello: Record<string, any> = { "Sandbox": setAssetsApproved, "Decentraland": setDclAssetsApproved, "DeNations": (x: string) => null }
          v.contractInst.methods
            .isApprovedForAll(newAccounts[0], poolAddy)
            .call()
            .then((s: boolean) => hello[v.name](s))
          return null;
        }
        )
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
  }, [nfts]);

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
        open={false}
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
        assetsApproved={sandboxAssetsApproved}
        dclAssetsApproved={dclAssetsApproved}

        addPendingLoans={refreshLoans}
        sandApproved={sandApproved}
        accounts={accounts}
        sym={sym}
        sandBalance={sandBalance}
        nfts={nfts}
        verses={verses}
        poolInst={poolInst}
        sandTokenInst={sandTokenInst}
        loans={loans}
      />
    </Router >
  );
}

export default App;
