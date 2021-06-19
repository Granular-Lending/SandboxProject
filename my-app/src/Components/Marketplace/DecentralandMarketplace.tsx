import { NFT, Loan, Verse } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";

interface DeProps {
  verseType: string, verses: Verse[], loans: Loan[], assets: NFT[]
}

const DecentralandAssetCard = (a: NFT, loans: Loan[]) => {
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
            style={{ objectFit: "contain" }}
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name}</h3>
            <p>
              {numberOfLoans} {numberOfLoans === 1 ? "loan" : "loans"} available
            </p>
            <p>
              {a.verseObj.name}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

const DecentralandMarketplace = (props: DeProps) => {
  return <div>
    <div style={{ backgroundColor: 'lightred' }}>

    </div>
    <div className="card-container" style={{ backgroundColor: "Red" }}>
      {/* TODO make this rebuild when metadata loads */
        props.assets.filter((a: NFT) => (props.verseType === "Any" || props.verseType === a.verseObj.name)).map((a: NFT) =>
          DecentralandAssetCard(a, props.loans)
        )}
    </div>
  </div>;
}

export default DecentralandMarketplace;
