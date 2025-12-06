import { useEffect, useState } from "react";
import { Card, Table, Typography, Tag, theme, Segmented } from "antd";
import { CrownFilled, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";
import axios from "../axios";

const { Text } = Typography;

const columns = [
  {
    title: "Pozycja",
    dataIndex: "key",
    render: (key) => {
      if (key === 1) return <CrownFilled style={{ color: "#FADB14", fontSize: 20 }} />;
      if (key === 2) return <CrownFilled style={{ color: "#C0C0C0", fontSize: 18 }} />;
      if (key === 3) return <CrownFilled style={{ color: "#CD7F32", fontSize: 18 }} />;
      return <Text strong>{key}</Text>;
    },
    width: 90,
    align: "center",
  },
  {
    title: "Użytkownik",
    dataIndex: "name",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Punkty",
    dataIndex: "points",
    sorter: (a, b) => a.points - b.points,
    render: (p) => <Text>{p.toLocaleString("pl-PL")}</Text>,
    align: "right",
    width: 120,
  },
  {
    title: "Seria dni",
    dataIndex: "streak",
    render: (s) => (
      <Tag
        icon={<FireOutlined />}
        color={s >= 10 ? "red" : s >= 5 ? "orange" : "default"}
      >
        {s} dni
      </Tag>
    ),
    align: "center",
    width: 130,
  },
  {
    title: "Najlepsze ćwiczenie",
    dataIndex: "bestExercise",
    render: (t) => (
      <Tag icon={<ThunderboltOutlined />} color="blue">
        {t || "—"}
      </Tag>
    ),
    align: "center",
    width: 160,
  },
];

export default function Ranking() {
  const { token } = theme.useToken();

  const [range, setRange] = useState("30"); // "30" | "all"
  const [ranking, setRanking] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/workouts/ranking", {
          params: {
            last: range === "30" ? "30" : "all",
          },
        });

        const { top = [], me: meData } = res.data || {};

        const mappedTop = top.map((item) => ({
          key: item.rank,
          name: item.username || `Użytkownik ${item.user_id}`,
          points: item.total_points || 0,
          streak: item.streak ?? 0,
          bestExercise: mapExerciseName(item.best_exercise),
        }));
        
        setRanking(mappedTop);
        
        if (meData) {
          setMe({
            key: meData.rank,
            name: meData.username || "Twoja pozycja",
            points: meData.total_points || 0,
            streak: meData.streak ?? 0,
            bestExercise: mapExerciseName(meData.best_exercise),
          });
        } else {
          setMe(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [range]);

  return (
    <Card
      title="Ranking użytkowników"
      extra={
        <Segmented
          options={[
            { label: "Ostatnie 30 dni", value: "30" },
            { label: "Zawsze", value: "all" },
          ]}
          value={range}
          onChange={setRange}
        />
      }
      styles={{ body: { padding: 16 } }}
      style={{
        borderRadius: 8,
        boxShadow: token.boxShadowTertiary,
        background: token.colorBgContainer,
      }}
    >
      <Table
        columns={columns}
        dataSource={ranking}
        pagination={false}
        size="middle"
        rowKey="key"
        loading={loading}
        locale={{
          emptyText: (
            <div
              style={{
                height: 120,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Brak danych. Wykonaj ćwiczenia, aby zobaczyć ranking.
            </div>
          ),
        }}
      />

      {me && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            borderRadius: token.borderRadiusLG,
            background: token.colorInfoBg,
            border: `1px solid ${token.colorInfoBorder}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ fontSize: 16, color: token.colorText }}>
            Twoja pozycja: {me.key}
          </Text>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Tag color="blue">{me.bestExercise}</Tag>
            <Tag color="green">{me.points} pkt</Tag>
            <Tag color="orange">{me.streak} dni serii</Tag>
          </div>
        </div>
      )}
    </Card>
  );
}

function mapExerciseName(code) {
  switch (code) {
    case "jumping-jacks":
      return "Pajacyki";
    case "squat":
      return "Przysiady";
    case "side-lunges":
      return "Wykroki boczne";
    case "side-bends":
      return "Skłony w bok";
    default:
      return code || "—";
  }
}
