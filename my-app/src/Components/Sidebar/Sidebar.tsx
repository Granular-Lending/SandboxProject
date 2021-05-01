import React from "react";

import "./Sidebar.css";
import profileImg from "./assets/kenny.jpg";
import sandIcon from "./assets/sandIcon.png";

interface SiderbarProps { landBalance: number, sandBalance: number, accounts: string[], sandTokenInst: any }

const Sidebar = (props: SiderbarProps) => {
  const [toAddress, setToAddress] = React.useState("0xf768524df0f3a766df8cae83243dc772b291f00c");
  const [toAddressSand, setToAddressSand] = React.useState("0xf768524df0f3a766df8cae83243dc772b291f00c");

  const transferSomeEther = () => {
    const params = [
      {
        from: props.accounts[0],
        to: toAddress,
        value: (10 ** 18).toString(16)
      },
    ];

    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params,
      })
      .then((result: any) => { })
      .catch((error: any) => { });
  }

  const transferSomeSand = () => {
    props.sandTokenInst.methods.transfer('0xffcf8fdee72ac11b5c542428b35eef5769c409f0', 1).send({ from: props.accounts[0] }).then(console.log).catch(console.error);
  }

  return (
    <div className="Sidebar">
      <div className="sidebar-container">
        <h2>Your Account</h2>
        <div>
          <img className="profileImg" src={profileImg} alt="user's profile" />
          <h3>
            Your address <b>{props.accounts}</b>
          </h3>
          <div className="accBalance">
            <h3>
              Your SAND balance :{" "}
              <span>
                <img className="sandIcon" src={sandIcon} alt="SAND logo" />
              </span>{" "}
              <b>{props.sandBalance}</b>
            </h3>
            <form onSubmit={transferSomeSand} >
              <label>
                Transfer 1 SAND to
                  <input type="text" value={toAddressSand} onChange={(e: any) => { setToAddressSand(e.target.value) }} />
              </label>
              <input type="submit" value="Go" />
            </form>
            <form onSubmit={transferSomeEther} >
              <label>
                Transfer 1 ETH to
                  <input type="text" value={toAddress} onChange={(e: any) => { setToAddress(e.target.value) }} />
              </label>
              <input type="submit" value="Go" />
            </form>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;
