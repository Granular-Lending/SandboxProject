import "./Marketplace.css";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

interface HomeProps {
  sym: string;
}
const Home = (props: HomeProps) => {
  return <div style={{ padding: 10 }} data-label="Home">
    <h1>Introduction</h1>
    <h2>Borrow & lend NFT's from The Sandbox!</h2>
    <h3>Tokens</h3>
    <p style={{ color: "white" }}>
      The project is currently in testing, so loans are bought with the Ropsten Faucet ({props.sym}) token. Get some free {props.sym} <a href="https://erc20faucet.com/" target="_blank" rel="noreferrer">here</a>.
    </p>
    <h3>Permissions</h3>
    <p style={{ color: "white" }}>
      To create or take out a loan, we need approval to transfer
      both {props.sym} tokens and ASSETS on your behalf. Head to the Permissions page
      and click 'approve' on both buttons.
    </p>
    <h3>Taking out a loan</h3>
    <p style={{ color: "white" }}>
      To take out a loan, head to the Assets page and click on an ASSET. The current loans are listed at the bottom of the page. Click "take out loan" to accept the terms of the
      loan.
      </p>
    <p>
      You will now be able to see the loan on the "Your Borrows" page.
    </p>
    <h3>Creating a loan</h3>
    <p style={{ color: "white" }}>
      To create out a loan, head to the Your Loans page. Click "create a loan",
      then select an ASSET and the terms of the loan.
    </p>
    <h3>Whitepaper</h3>
    <Link to="/whitepaper">
      <Button variant='contained' style={{ margin: 8, fontSize: '1em' }}>
        View the whitepaper
      </Button>
    </Link>
  </div >
};

export default Home;
