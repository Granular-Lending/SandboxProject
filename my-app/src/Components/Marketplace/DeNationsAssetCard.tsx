import { NFT, Loan } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";

const DeNationsAssetCard = (a: NFT, loans: Loan[]) => {
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
      <div className="productCardDeNations">
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
              {a.verse}
            </p>
          </div>
        </div>
      </div>
    </Link >
  );
};

export default DeNationsAssetCard;
