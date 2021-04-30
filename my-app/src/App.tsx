import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import Web3 from "web3";

import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";

const erc20abi = require("./abis/erc20.json");
const erc721abi = require("./abis/erc721.json");
const erc1155abi = require("./abis/erc1155.json");

export interface Asset {
  id: string;
  name: string;
  classification: { type: string; theme: string; categories: string[] };
}

export const EQUIPMENT_TOKEN_IDS = [
  "26059276970032186212506257052788207833935590993847855924189730778752558827520",
  "40785833732304342849735419653626615027421227776496020677721887159020450484224",
  "40785833732304342849735419653626615027421227776496020677721887159020450484225",
  "55464657044963196816950587289035428064568320970692304673817341489687673452544",
  "59877022449356993441109123519648614159160891474231538650442489089192695443456",
];

declare global {
  interface Window {
    ethereum: any;
  }
}

const TEST_ACCOUNTS = ["0xf768524df0f3a766df8cae83243dc772b291f00c"];
const USE_TEST_ACCOUNTS = false;

const SAND_TOKEN_ADDRESS = "0xF217FD6336182395B53d9d55881a0D838a6CCc9A";
const LAND_TOKEN_ADDRESS = "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a";
const ASSET_TOKEN_ADDRESS = "0xa342f5D851E866E18ff98F351f2c6637f4478dB5";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://ropsten.infura.io/ws/v3/1002239177e9489a9ec78a14729a043d"
  )
);

const sandTokenInst = new web3.eth.Contract(erc20abi, SAND_TOKEN_ADDRESS);
const landTokenInst = new web3.eth.Contract(erc721abi, LAND_TOKEN_ADDRESS);
const assetTokenInst = new web3.eth.Contract(erc1155abi, ASSET_TOKEN_ADDRESS);

const assets = EQUIPMENT_TOKEN_IDS.map((id) => {
  let metadata: any;
  try {
    metadata = require(`./metadata/${id}.json`);
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
  const asset: Asset = {
    id: id,
    name: metadata.name,
    classification: metadata.sandbox.classification,
  };
  return asset;
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
  const [landBalance, setLandBalance] = React.useState(-1);
  const [assetBalances, setAssetBalances] = React.useState(
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
      setAccounts(USE_TEST_ACCOUNTS ? TEST_ACCOUNTS : newAccounts);
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
    }
  }, [accounts]);

  React.useEffect(() => {
    if (accounts[0] !== "") {
      landTokenInst.methods
        .balanceOf(accounts[0])
        .call()
        .then(function (bal: string) {
          setLandBalance(parseFloat(bal));
        });
    }
  }, [accounts]);

  React.useEffect(() => {
    if (accounts[0] !== "") {
      assetTokenInst.methods
        .balanceOfBatch(
          Array(EQUIPMENT_TOKEN_IDS.length).fill(accounts[0]),
          EQUIPMENT_TOKEN_IDS
        )
        .call()
        .then(function (bals: number[]) {
          setAssetBalances(bals);
        });
    }
  }, [accounts]);

  const metaMaskLogin = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: React.SetStateAction<string[]>) =>
          setAccounts(USE_TEST_ACCOUNTS ? TEST_ACCOUNTS : newAccounts)
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
        landBalance={landBalance}
        assets={assets}
        assetBalances={assetBalances}
        assetTokenInst={assetTokenInst}
        tokenids={EQUIPMENT_TOKEN_IDS}
      />
    </div>
  );
}

export default App;
