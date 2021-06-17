import { NFT, Loan } from "../../App";
import "./Marketplace.css";
import { Link } from "react-router-dom";

const SandboxAssetCard = (a: NFT, loans: Loan[]) => {
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
      <div className="productCard">
        <div className="card-container-data">
          <img
            alt="missing metadata"
            style={{ objectFit: "contain" }}
            src={a.metadata.image}
          />
          <div className="cardData">
            <h3>{a.metadata.name.length > 22 ? `${a.metadata.name.slice(0, 22)}...` : a.metadata.name}</h3>
            <h4 style={{ color: 'lightgrey' }}>
              {`${a.metadata.sandbox.classification.type} | ${a.metadata.sandbox.classification.theme}`}
            </h4>
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

export default SandboxAssetCard;
