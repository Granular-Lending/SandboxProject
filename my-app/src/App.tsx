import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import Web3 from "web3";
const erc20abi = require("./erc20.json");
const erc721abi = require("./erc721.json");
const erc1155abi = require("./erc1155.json");

declare global {
  interface Window {
    ethereum: any;
  }
}

const PANDA_ACCOUNT_ADDRESS = "0x7903259ad9ff4f4f22bef350ab794e8193686e7b";
const USE_PANDA_ACCOUNTS = true;

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

const SAND_TOKEN_ADDRESS = "0x3845badade8e6dff049820680d1f14bd3903a5d0";
const LAND_TOKEN_ADDRESS = "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a";
const ASSET_TOKEN_ADDRESS = "0xa342f5D851E866E18ff98F351f2c6637f4478dB5";

const TOKEN_IDS = [
  "105937151976444624100294759288692568602605949000810188143641994461573407576064",
  "40785833732304342849735419653626615027421227776496020677721887159020425320449",
  "24526111578964355427464788391204295010760968458116003736309517252594013046784",
];

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
  creator: string;
  uri: string;
  amountOwned: number;
}

const assets: Asset[] = [];
for (let i = 0; i < TOKEN_IDS.length; i++) {
  const asset: Asset = {
    id: TOKEN_IDS[i],
    creator: "",
    uri: "",
    amountOwned: -1,
  };
  tokenTokenInst.methods
    .creatorOf(TOKEN_IDS[i])
    .call()
    .then(function (addr: string) {
      asset.creator = addr;
    });
  tokenTokenInst.methods
    .uri(TOKEN_IDS[i])
    .call()
    .then(function (uri: string) {
      asset.uri = uri;
    });
  tokenTokenInst.methods
    .balanceOf(PANDA_ACCOUNT_ADDRESS, TOKEN_IDS[i])
    .call()
    .then(function (amount: number) {
      asset.amountOwned = amount;
    });
  assets.push(asset);
}

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
        <h2>ASSET MARKETPLACE</h2>
        <table>
          <tr>
            <th>Token ID</th>
            <th>Metadata URI</th>
            <th>Amount Owned</th>
          </tr>
          {assets.map((a) => (
            <tr>
              <td>{a.id}</td>
              <td>{a.uri}</td>
              <td>{a.amountOwned}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default App;
