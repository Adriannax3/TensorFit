import { Card, Row, Col, Statistic } from "antd";
import { GiRunningNinja, GiStopwatch, GiPodiumWinner, GiStrongMan } from "react-icons/gi";

const mockData = {
  longestStreakDays: 14,
  longestWorkout: { type: "squat", duration: 1800 },
  mostFrequent: "pushup",
  biggestReps: { type: "squat", count: 120 },
};

const labelMap = {
  squat: "Przysiady",
  pushup: "Pompki",
  plank: "Deska",
  jumpingJack: "Pajacyki",
  burpee: "Burpees",
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
              value={`${mockData.longestStreakDays} dni`}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiStopwatch size={40} color="#5AD8A6" />
            <Statistic
              title="Najdłuższy trening"
              value={formatDuration(mockData.longestWorkout.duration)}
              suffix={` (${labelMap[mockData.longestWorkout.type]})`}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiPodiumWinner size={40} color="#F6BD16" />
            <Statistic
              title="Najczęściej wykonujesz"
              value={labelMap[mockData.mostFrequent]}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card variant="borderless" style={{ textAlign: "center", height: "100%" }}>
            <GiStrongMan size={40} color="#E8684A" />
            <Statistic
              title="Największa seria powtórzeń"
              value={`${mockData.biggestReps.count}x`}
              suffix={` ${labelMap[mockData.biggestReps.type]}`}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
