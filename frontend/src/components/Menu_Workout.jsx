import { Card } from "antd";
import { Link } from "react-router-dom";
import "../styles/menu.scss";

export default function MenuWorkout() {
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
        <Link to="/session/side-lunges" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Wykroki w bok
          </Card>
        </Link>
        {/* <Link to="/session/right-arm-raise" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Podnoszenie prawej ręki
          </Card>
        </Link>*/}
        <Link to="/session/jumping-jacks" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Pajacyki
          </Card>
        </Link>
        <Link to="/session/squat" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Przysiady
          </Card>
        </Link>
        <Link to="/session/side-bends" className="menu-link">
          <Card variant="outlined" className="menu-card">
            Skłony w bok
          </Card>
        </Link>
      </div>
    </div>
  );
}
