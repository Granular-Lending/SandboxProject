import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import Web3 from "web3";
const abi = require("./erc20.json");

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

const SAND_TOKEN_ADDRESS = "0x3845badade8e6dff049820680d1f14bd3903a5d0";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();

  const [sandBalance, setSandBalance] = React.useState(-1);

  let web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://mainnet.infura.io/ws/v3/1002239177e9489a9ec78a14729a043d"
    )
  );

  const tokenInst = new web3.eth.Contract(abi, SAND_TOKEN_ADDRESS);

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        if (onboarding.current) {
          onboarding.current.stopOnboarding();
        }
      } else {
        setButtonText(CONNECT_TEXT);
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

  React.useEffect(() => {
    if (accounts.length > 0) {
      tokenInst.methods
        .balanceOf(accounts[0])
        .call()
        .then(function (bal: string) {
          console.log(bal);
          setSandBalance(parseFloat(bal));
        });
    }
  }, [accounts, tokenInst.methods]);

  return (
    <div>
      <h1>Granular lending</h1>
      <button disabled={isDisabled} onClick={onClick}>
        {buttonText}
      </button>
      <div>
        <h2>Your account</h2>
        <p>
          Your MetaMask address is <b>{accounts[0]}</b>
        </p>
        <p>
          Your SAND balance is <b>{sandBalance}</b>
        </p>
      </div>
    </div>
  );
}

export default App;
