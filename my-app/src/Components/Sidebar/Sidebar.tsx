import React from "react";

import "./Sidebar.css";
import profileImg from "./assets/kenny.jpg";
import sandIcon from "./assets/sandIcon.png";

interface SiderbarProps {
  landBalance: number,
  sandBalance: number,
  accounts: string[],
  sandTokenInst: any,
  assetTokenInst: any
}

const Sidebar = (props: SiderbarProps) => {
  const [toAddressEth, setToAddressEth] = React.useState("0xf768524df0f3a766df8cae83243dc772b291f00c");
  const [toAddressSand, setToAddressSand] = React.useState("0xf768524df0f3a766df8cae83243dc772b291f00c");

  const transferSomeEther = () => {
    const params = [
      {
        from: props.accounts[0],
        to: toAddressEth,
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
    props.sandTokenInst.methods.transfer(toAddressSand, 1).send({ from: props.accounts[0] }).then(console.log).catch(console.error);
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
                  <input type="text" value={toAddressEth} onChange={(e: any) => { setToAddressEth(e.target.value) }} />
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