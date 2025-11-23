import React from "react";
import { Card, Table, Typography, Tag, theme } from "antd";
import { CrownFilled, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";

const { Text } = Typography;

const mockRanking = [
  { key: 1,  name: "Anka123",           points: 1560, streak: 14, bestExercise: "Przysiady" },
  { key: 2,  name: "RybkaAndrzej1980",  points: 1420, streak: 11, bestExercise: "Pajacyki" },
  { key: 3,  name: "KasiaFit",          points: 1280, streak: 9,  bestExercise: "Pajacyki" },
  { key: 4,  name: "TomekWlkp",         points: 1210, streak: 8,  bestExercise: "Wykroki" },
  { key: 5,  name: "Marek_PL",          points: 990,  streak: 6,  bestExercise: "Przysiady" },
  { key: 6,  name: "BasiaRuns",         points: 940,  streak: 5,  bestExercise: "Przysiady" },
  { key: 7,  name: "Ola_98",            points: 910,  streak: 5,  bestExercise: "Pajacyki" },
  { key: 8,  name: "ZbyszekPower",      points: 850,  streak: 4,  bestExercise: "Pajacyki" },
  { key: 9,  name: "JuliaKowal",        points: 780,  streak: 3,  bestExercise: "Przysiady" },
  { key: 10, name: "Pawełek",           points: 720,  streak: 2,  bestExercise: "Przysiady" },
];

const yourPosition = {
  key: 198,
  name: "Ty 😎",
  points: 240,
  streak: 1,
  bestExercise: "Pompki",
};

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
        {t}
      </Tag>
    ),
    align: "center",
    width: 160,
  },
];

export default function Ranking() {
  const { token } = theme.useToken();

  return (
    <Card
      title="🏆 Ranking użytkowników"
      styles={{ body: { padding: 16 } }}
      style={{
        borderRadius: 8,
        boxShadow: token.boxShadowTertiary,
        background: token.colorBgContainer,
      }}
    >
      <Table
        columns={columns}
        dataSource={mockRanking}
        pagination={false}
        size="middle"
        rowKey="key"
      />

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
          Twoja pozycja: {yourPosition.key}
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Tag color="blue">{yourPosition.bestExercise}</Tag>
          <Tag color="green">{yourPosition.points} pkt</Tag>
          <Tag color="orange">{yourPosition.streak} dni serii</Tag>
        </div>
      </div>
    </Card>
  );
}
