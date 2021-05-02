import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import Web3 from "web3";

import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";

const erc20abi = require("./abis/erc20.json");
const erc1155abi = require("./abis/erc1155.json");
const poolabi = require("./abis/pool.json");

export interface Asset {
  id: string;
  name: string;
  image: string;
  classification: { type: string; theme: string; categories: string[] };
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
];

const URIS = [
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
  "ipfs://bafybeif4yerch2yxjtpff5isiq2dkto2t62a535ppbmqsrzbtjrq7i35eu/5.json"
]

declare global {
  interface Window {
    ethereum: any;
  }
}

const web3 = new Web3(window.ethereum);

const USE_MAIN = false;

const SAND_TOKEN_ADDRESS = USE_MAIN ? "0x3845badAde8e6dFF049820680d1F14bD3903a5d0" : "0x0000000000000000000000000000000000000000";
const ASSET_TOKEN_ADDRESS = USE_MAIN ? "0xa342f5D851E866E18ff98F351f2c6637f4478dB5" : "0x767c98f260585e9da36faef70d1691992bc1addf";
const POOL_ADDRESS = USE_MAIN ? "0x0000000000000000000000000000000000000000" : "0x3b20F0B97290c4BF2cEA6DEf9340CEb5fd8f36E3";

const sandTokenInst = new web3.eth.Contract(erc20abi, SAND_TOKEN_ADDRESS);
const assetTokenInst = new web3.eth.Contract(erc1155abi, ASSET_TOKEN_ADDRESS);
const poolInst = new web3.eth.Contract(poolabi, POOL_ADDRESS);

const assets = EQUIPMENT_TOKEN_IDS.map((id) => {
  try {
    const metadata = require(`./metadata/${URIS[EQUIPMENT_TOKEN_IDS.indexOf(id)].slice(7)}`);

    return {
      id: id,
      name: metadata.name,
      classification: metadata.sandbox.classification,
      image: metadata.image.slice(6)
    };;
  } catch (ex) {
    return {
      id: id,
      name: "missing metadata",
      classification: {
        type: "missing metadata",
        theme: "missing metadata",
        categories: [],
      },
    };
  }
});

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

function App() {
  const [loginButtonText, setLoginButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([""]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sandBalance, setSandBalance] = React.useState(-1);
  const [assetBalances, setAssetBalances] = React.useState(
    Array(EQUIPMENT_TOKEN_IDS.length).fill(-1)
  );
  const [poolAssetBalances, setPoolAssetBalances] = React.useState(
    Array(EQUIPMENT_TOKEN_IDS.length).fill(-1)
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
    function handleNewAccounts(newAccounts: React.SetStateAction<string[]>) {
      setAccounts(newAccounts);
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
  }, []);

  React.useEffect(() => {
    if (accounts[0] !== "") {
      sandTokenInst.methods
        .balanceOf(accounts[0])
        .call()
        .then(function (bal: string) {
          setSandBalance(parseFloat(bal));
        });
      assetTokenInst.methods
        .balanceOfBatch(
          Array(EQUIPMENT_TOKEN_IDS.length).fill(accounts[0]),
          EQUIPMENT_TOKEN_IDS
        )
        .call()
        .then(function (bals: number[]) {
          setAssetBalances(bals);
        });
      assetTokenInst.methods
        .balanceOfBatch(
          Array(EQUIPMENT_TOKEN_IDS.length).fill(POOL_ADDRESS),
          EQUIPMENT_TOKEN_IDS
        )
        .call()
        .then(function (bals: number[]) {
          setPoolAssetBalances(bals);
        });
    }
  }, [accounts]);

  const metaMaskLogin = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: React.SetStateAction<string[]>) =>
          setAccounts(newAccounts)
        );
    } else {
      if (onboarding.current) {
        onboarding.current.startOnboarding();
      }
    }
  };

  return (
    <div>
      <Navbar
        disabled={isDisabled}
        onClick={metaMaskLogin}
        loginButtonText={loginButtonText}
      />
      <Hero
        accounts={accounts}
        sandBalance={sandBalance}
        assets={assets}
        assetBalances={assetBalances}
        poolAssetBalances={poolAssetBalances}
        assetTokenInst={assetTokenInst}
        poolInst={poolInst}
        tokenids={EQUIPMENT_TOKEN_IDS}
        sandTokenInst={sandTokenInst}
      />
    </div>
  );
}

export default App;
