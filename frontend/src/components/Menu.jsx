import { useState } from "react";
import { Card, Button } from "antd";
import "../styles/menu.scss";
import MenuWorkout from "./Menu_Workout";
import MenuStats from "./Menu_Statistics";
import { useLocation } from "react-router-dom";

export default function Menu() {
  const location = useLocation();
  const [option, setOption] = useState(
    location.state?.statsMenu
      ? "stats"
      : location.state?.workoutMenu
      ? "workouts"
      : null
  );

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
      </div>
    </div>
  );
}
