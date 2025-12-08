import { useState } from "react";
import { Card, Button } from "antd";
import "../styles/menu.scss";
import MenuWorkout from "./Menu_Workout";
import MenuStats from "./Menu_Statistics";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Menu() {
  const location = useLocation();
  const [option, setOption] = useState(
    location.state?.statsMenu
      ? "stats"
      : location.state?.workoutMenu
      ? "workouts"
      : null
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  if (option == "workouts") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          gap: 20,
        }}
      >
        <Button type="primary" size="large" onClick={() => setOption(null)}>
          ← Powrót
        </Button>
        <MenuWorkout />
      </div>
    );
  }
  
  if (option == "stats") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          gap: 20,
        }}
      >
        <Button type="primary" size="large" onClick={() => setOption(null)}>
          ← Powrót
        </Button>
        <MenuStats />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
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
          gap: 20,
        }}
      >
        <div className="menu-link">
          <Card
            variant="outlined"
            className="menu-card"
            onClick={() => setOption("workouts")}
            hoverable
          >
            Ćwiczenia
          </Card>
        </div>
        <div className="menu-link">
          <Card
            variant="outlined"
            className="menu-card"
            onClick={() => setOption("stats")}
            hoverable
          >
            Statystyki
          </Card>
        </div>
        <div className="menu-link">
          <Card
            variant="outlined"
            className="menu-card"
            onClick={() => navigate("/entries")}
            hoverable
          >
            Wpisy
          </Card>
        </div>
        <div className="menu-link">
          <Card
            variant="outlined"
            className="menu-card"
            onClick={() => navigate("/account")}
            hoverable
          >
            Moje konto
          </Card>
        </div>
        {user.isAdmin && <div className="menu-link">
          <Card
            variant="outlined"
            className="menu-card"
            onClick={() => navigate("/admin")}
            hoverable
          >
            Panel admina
          </Card>
        </div>}
      </div>
    </div>
  );
}
