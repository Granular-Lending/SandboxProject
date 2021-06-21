import { NFT, Loan } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";
import { DeProps } from "./Marketplace";

const NftCard = (a: NFT, loans: Loan[]) => {
  const numberOfLoans = loans.filter(
    (l: Loan) =>
      l.asset_id === a.id &&
      l.state === "0" && Date.now() < l.entry * 1000 + l.duration * 1000
  ).length;

  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/asset/${a.id}`}
    >
      <div className="productCardDec">
        <div className="card-container-data">
          <img
            alt="missing metadata"
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name}</h3>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

const DecentralandMarketplace = (props: DeProps) =>
  <div className="card-container" style={{ backgroundColor: "#151515" }}>
    {/* TODO make this rebuild when metadata loads */
      props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verse.name)).map((a: NFT) =>
        NftCard(a, props.loans)
      )}
  </div>;


export default DecentralandMarketplace;
