import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { GiRunningNinja, GiStopwatch, GiPodiumWinner, GiStrongMan } from "react-icons/gi";
import { getMyWorkoutsStats } from "../../services/api";

const labelMap = {
  squat: "Przysiady",
  "jumping-jacks": "Pajace",
  "side-lunges": "Wykroki w bok",
  "side-bends": "Skłony w bok",
};

function formatDuration(totalSeconds) {
  const s = Math.floor(totalSeconds || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h > 0) parts.push(`${h} h`);
  if (m > 0) parts.push(`${m} min`);
  if (sec > 0 || parts.length === 0) parts.push(`${sec} s`);
  return parts.join(" ");
}

export default function ExerciseHighlights() {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDataset() {
      setLoading(true);
      try { 
        const res = await getMyWorkoutsStats();
        setDataset(res);
      } catch (error) {
        console.error("Error fetching workout stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDataset();
  }, []);
  
  if (loading) return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Spin size="large" />
    </div>
  );

  if(!dataset.longestStreakDays 
    || !dataset.biggestReps
    || !dataset.longestWorkout
    || !dataset.mostFrequent
  ) return (
    <Card style={{ 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      height: "100%" 
    }}>
      Brak danych. <br />
      Wykonaj ćwiczenia by zobaczyć statystyki.
    </Card>
  );

  return (
    <Card
      title="Twoje statystyki"
      style={{ marginTop: 24, borderRadius: 8 }}
      styles={{ body: { padding: "16px 24px", height: "100%" } }} 
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}> {/* ✅ */}
            <GiRunningNinja size={40} color="#5B8FF9" />
            <Statistic
              title="Najdłuższa seria"
              value={`${dataset.longestStreakDays} ${dataset.longestStreakDays === 1 ? 'dzień' : 'dni'}`}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiStopwatch size={40} color="#5AD8A6" />
            <Statistic
              title="Najdłuższy trening"
              value={formatDuration(dataset.longestWorkout.duration)}
              suffix={` (${labelMap[dataset.longestWorkout.type]})`}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiPodiumWinner size={40} color="#F6BD16" />
            <Statistic
              title="Najczęściej wykonujesz"
              value={labelMap[dataset.mostFrequent]}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiStrongMan size={40} color="#E8684A" />
            <Statistic
              title="Największa seria powtórzeń"
              value={`${dataset.biggestReps.count}x`}
              suffix={` ${labelMap[dataset.biggestReps.type]}`}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
