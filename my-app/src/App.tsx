import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import Web3 from "web3";
import image1 from "./images/40785833732304342849735419653626615027421227776496020677721887159020450484224.png";
import image2 from "./images/40785833732304342849735419653626615027421227776496020677721887159020450484225.png";
import image3 from "./images/55464657044963196816950587289035428064568320970692304673817341489687673452544.png";

const erc20abi = require("./abis/erc20.json");
const erc721abi = require("./abis/erc721.json");
const erc1155abi = require("./abis/erc1155.json");

declare global {
  interface Window {
    ethereum: any;
  }
}
const EQUIPMENT_TOKEN_IDS = [
  "40785833732304342849735419653626615027421227776496020677721887159020450484224",
  "40785833732304342849735419653626615027421227776496020677721887159020450484225",
  "55464657044963196816950587289035428064568320970692304673817341489687673452544",
];

const images: Record<string, string> = {
  "40785833732304342849735419653626615027421227776496020677721887159020450484224": image1,
  "40785833732304342849735419653626615027421227776496020677721887159020450484225": image2,
  "55464657044963196816950587289035428064568320970692304673817341489687673452544": image3,
};

const PANDA_ACCOUNT_ADDRESS = "0x7903259ad9ff4f4f22bef350ab794e8193686e7b";
const USE_PANDA_ACCOUNTS = true;

const SAND_TOKEN_ADDRESS = "0x3845badade8e6dff049820680d1f14bd3903a5d0";
const LAND_TOKEN_ADDRESS = "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a";
const ASSET_TOKEN_ADDRESS = "0xa342f5D851E866E18ff98F351f2c6637f4478dB5";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    "wss://mainnet.infura.io/ws/v3/1002239177e9489a9ec78a14729a043d"
  )
);

const sandTokenInst = new web3.eth.Contract(erc20abi, SAND_TOKEN_ADDRESS);
const landTokenInst = new web3.eth.Contract(erc721abi, LAND_TOKEN_ADDRESS);
const tokenTokenInst = new web3.eth.Contract(erc1155abi, ASSET_TOKEN_ADDRESS);

interface Asset {
  id: string;
  uri: string;
  name: string;
  classification: { type: string; theme: string; categories: string[] };
  image: string;
  amountOwned: number;
}

const assets = EQUIPMENT_TOKEN_IDS.map((id) => {
  const metadata = require(`./metadata/${id}.json`);
  const asset: Asset = {
    id: id,
    uri: "",
    name: metadata.name,
    classification: metadata.sandbox.classification,
    image: images[id],
    amountOwned: -1,
  };
  tokenTokenInst.methods
    .uri(id)
    .call()
    .then(function (uri: string) {
      asset.uri = uri;
    });
  tokenTokenInst.methods
    .balanceOf(PANDA_ACCOUNT_ADDRESS, id)
    .call()
    .then(function (amount: number) {
      asset.amountOwned = amount;
    });
  return asset;
});

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

function App() {
  const [loginButtonText, setLoginButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sandBalance, setSandBalance] = React.useState(-1);
  const [landBalance, setLandBalance] = React.useState(-1);

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setLoginButtonText(CONNECTED_TEXT);
        setDisabled(true);
        if (onboarding.current) {
          onboarding.current.stopOnboarding();
        }
      } else {
        setLoginButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts: React.SetStateAction<never[]>) {
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
    if (accounts.length > 0) {
      sandTokenInst.methods
        .balanceOf(USE_PANDA_ACCOUNTS ? PANDA_ACCOUNT_ADDRESS : accounts[0])
        .call()
        .then(function (bal: string) {
          console.log(bal);
          setSandBalance(parseFloat(bal));
        });
    }
  }, [accounts]);

  React.useEffect(() => {
    if (accounts.length > 0) {
      landTokenInst.methods
        .balanceOf(USE_PANDA_ACCOUNTS ? PANDA_ACCOUNT_ADDRESS : accounts[0])
        .call()
        .then(function (bal: string) {
          console.log(bal);
          setLandBalance(parseFloat(bal));
        });
    }
  }, [accounts]);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: React.SetStateAction<never[]>) =>
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
      <h1>Granular lending</h1>
      <div>
        <h2>Login</h2>
        <button disabled={isDisabled} onClick={onClick}>
          {loginButtonText}
        </button>
      </div>
      <div>
        <h2>Your account</h2>
        <p>
          Your address is{" "}
          <b>{USE_PANDA_ACCOUNTS ? PANDA_ACCOUNT_ADDRESS : accounts[0]}</b>
        </p>
        <p>
          Your SAND balance is <b>{sandBalance}</b>
        </p>
        <p>
          Your LAND balance is <b>{landBalance}</b>
        </p>
      </div>
      <div>
        <h2>Equipment Marketplace</h2>
        <div style={{ display: "flex" }}>
          {assets.map((a) => (
            <div style={{ margin: 20 }}>
              <img alt="logo" style={{ height: "100px" }} src={a.image} />
              <h3>
                {a.name} | {a.classification.theme}
              </h3>
              <p>You own {a.amountOwned}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
