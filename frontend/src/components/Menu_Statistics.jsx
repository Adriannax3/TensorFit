import { Card } from "antd";
import { Link } from "react-router-dom";
import "../styles/menu.scss";

export default function MenuStats() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 800,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/stats" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Moje statystyki
          </Card>
        </Link>
        <Link to="/ranking" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Ranking
          </Card>
        </Link>
      </div>
    </div>
  );
}
