import MetaMaskOnboarding from "@metamask/onboarding";
import React, { useState } from "react";
import Web3 from "web3";
import { BlockTransactionObject } from "web3-eth"

import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import Marketplace from "./Components/Marketplace/Marketplace";
import { AssetCardProps, DecentralandCard, DeNationsCard, SandboxCard } from "./Components/Marketplace/AssetPage";
import CryptoVoxelsMarketplace from "./Components/Marketplace/CryptoVoxelsMarketplace";
import SandboxMarketplace from "./Components/Marketplace/SandboxMarketplace";
import DecentralandMarketplace from "./Components/Marketplace/DecentralandMarketplace";

const erc20abi = require("./abis/erc20.json");
const erc721abi = require("./abis/erc721.json");
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
  verse: Verse;
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

export class ERC20 {
  symbol = "";
  balance = 0;
  allowance = 0;
  contractInst: any;

  constructor(
    address: string,
  ) {
    this.contractInst = new web3.eth.Contract(erc20abi, address);
  }
}

export class Verse {
  name: string;
  nftIds: string[];
  getMetadata: (uri: string) => Promise<any>;
  uriFunction: (id: string) => any;
  contractInst: any;
  accougy: (props: AssetCardProps) => JSX.Element;
  marketplace: any;
  approved: boolean;

  constructor(
    name: string,
    nftIds: string[],
    getMetadata: (uri: string) => Promise<any>,
    address: string,
    accougy: (props: AssetCardProps) => JSX.Element,
    marketplace: any,
    isERC721: boolean,
  ) {
    this.name = name;
    this.nftIds = nftIds;
    this.getMetadata = getMetadata;

    if (isERC721) {
      this.contractInst = new web3.eth.Contract(erc721abi, address);
      this.uriFunction = this.contractInst.methods.tokenURI;
    } else {
      this.contractInst = new web3.eth.Contract(erc1155abi, address);
      this.uriFunction = this.contractInst.methods.uri;
    }
    this.marketplace = marketplace;
    this.approved = false;
    this.accougy = accougy;
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const ERC20_MAINNET = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const POOL_MAINNET = '0x0000000000000000000000000000000000000000';

const ERC20_ROPSTEN = '0xFab46E002BbF0b4509813474841E0716E6730136';
const POOL_ROPSTEN = '0x72D759a2FB537356152606AD33557796eDD00386';

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

const SIGNATURE_TO_FUNCTION: Record<string, string> = { '0xe6f97ea3': 'collect', '0xb9fae650': 'create', '0xe9126154': 'return', '0xafbb231e': 'timeout', '0xadfbe22f': 'accept' };

const web3 = new Web3(window.ethereum);

const ROPSTEN_VERSES: Verse[] = [
  new Verse('Test',
    [
      "26059276970032186212506257052788207833935590993847855924189730778752558827520",
      "40785833732304342849735419653626615027421227776496020677721887159020450484224",
      "40785833732304342849735419653626615027421227776496020677721887159020450484225",
    ],
    async (uri: string): Promise<any> => {
      let url = `https://ipfs.io/ipfs/${uri.slice(12)}`;

      return await fetch(url)
        .then(res => res.json())
        .then((metadata: any) => {
          return metadata;
        });
    },
    '0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8',
    DecentralandCard,
    DecentralandMarketplace,
    false
  ),
  new Verse('Rarible',
    [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ],
    async (uri: string): Promise<any> => {
      let url = `https://ipfs.io/ipfs/${uri.slice(12)}`;

      return await fetch(url)
        .then(res => res.json())
        .then((metadata: any) => {
          return metadata;
        });
    },
    '0x25ec3bbc85af8b7498c8f5b1cd1c39675431a13c',
    DecentralandCard,
    DecentralandMarketplace,
    true
  ),
]

const MAINNET_VERSES: Verse[] = [
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
    '0xa342f5d851e866e18ff98f351f2c6637f4478db5',
    SandboxCard,
    SandboxMarketplace,
    false
  ),
  new Verse('Decentraland',
    [
      "0",
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
    '0xD35147BE6401dcb20811f2104c33dE8E97ED6818',
    DecentralandCard,
    DecentralandMarketplace,
    true
  ),
  new Verse('CryptoVoxels',
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i: number) => i.toString()),
    async (uri: string): Promise<any> => {
      return await fetch(uri)
        .then(res => res.json())
        .then((metadata: any) => {
          return metadata;
        });
    },
    '0xa58b5224e2FD94020cb2837231B2B0E4247301A6',
    DeNationsCard,
    CryptoVoxelsMarketplace,
    false
  ),
]

function App() {
  const [poolInst, setPoolTokenInst] = useState(new web3.eth.Contract(poolabi, ""));

  const [loginButtonText, setLoginButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([""]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sandToken, setSandToken] = useState(new ERC20(""));

  const [verses, setVerses]: [Verse[], any] = useState([]);
  const [loans, setLoans]: [Loan[], any] = useState([]);
  const [nfts, setNfts]: [NFT[], any] = useState([]);

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
            const pendingFunction = SIGNATURE_TO_FUNCTION[x.input.slice(0, 10)]
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

        let sandAddy = ERC20_MAINNET;
        let poolAddy = POOL_MAINNET;
        let veg = MAINNET_VERSES;
        if (is_ropsten) {
          sandAddy = ERC20_ROPSTEN;
          poolAddy = POOL_ROPSTEN;
          veg = ROPSTEN_VERSES;
        }
        setVerses(veg);

        const poolInstTemp = new web3.eth.Contract(poolabi, poolAddy);
        setPoolTokenInst(poolInstTemp);
        refreshLoans(poolInstTemp, newAccounts[0]);

        const sandTokenTemp = new ERC20(sandAddy);
        setSandToken(sandTokenTemp);

        sandTokenTemp.contractInst.methods
          .symbol()
          .call()
          .then(function (s: string) {
            const tempy = sandToken;
            tempy.symbol = s;
            setSandToken(tempy);
          });
        sandTokenTemp.contractInst.methods
          .balanceOf(newAccounts[0])
          .call()
          .then(function (bal: number) {
            const tempy = sandToken;
            tempy.balance = bal;
            setSandToken(tempy);
          });
        sandTokenTemp.contractInst.methods
          .allowance(newAccounts[0], poolAddy)
          .call()
          .then((allow: number) => {
            const tempy = sandToken;
            tempy.allowance = allow;
            setSandToken(tempy);
          })

        veg.map((v: Verse) => {
          v.contractInst.methods
            .isApprovedForAll(newAccounts[0], poolAddy)
            .call()
            .then((s: boolean) => {
              const tempy = veg;
              const index = tempy.findIndex((f: Verse) => f.name === v.name);
              if (index !== -1) {
                tempy[index].approved = s;
              }
              setVerses(tempy);
            })

          v.nftIds.map((id: string) => {
            v.uriFunction(id)
              .call()
              .then((uri: string) =>
                v.getMetadata(uri).then((metadata: any) => {
                  const tempy = nfts;
                  let index = nfts.findIndex((n: NFT) => n.id === id);
                  if (index === -1) {
                    index = tempy.length;
                    tempy.push({ id: id, balance: 0, metadata: {}, verse: v });
                  }
                  tempy[index].metadata = metadata;
                  setNfts(tempy);
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
                let index = nfts.findIndex((n: NFT) => n.id === v.nftIds[i]);
                if (index === -1) {
                  index = tempy.length;
                  tempy.push({ id: v.nftIds[i], balance: 0, metadata: {}, verse: v });
                }
                tempy[index].balance = bals[i];
              }
              setNfts(tempy);
            });
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
    // eslint-disable-next-line
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
        accounts={accounts}
      />
      <Marketplace
        addPendingLoans={refreshLoans}
        accounts={accounts}
        nfts={nfts}
        verses={verses}
        poolInst={poolInst}
        loans={loans}
        sandToken={sandToken}
      />
    </Router >
  );
}

export default App;
