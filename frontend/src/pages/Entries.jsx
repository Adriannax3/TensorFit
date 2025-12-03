import { useState } from "react";
import { Layout, Button, Card, Avatar, Space, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { LikeOutlined, ShareAltOutlined, MessageOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const mockEntries = [
  {
    id: 1,
    username: "Marek",
    avatar: "https://i.pravatar.cc/150?img=47",
    time: "2 godz. temu",
    text: "Dzisiaj zrobiłem najlepszy trening nóg!",
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    username: "Anna",
    avatar: "https://i.pravatar.cc/150?img=23",
    time: "wczoraj",
    text: "Polecam rozgrzewkę TensorFit🔥",
    image: "https://images.unsplash.com/photo-1526401485004-2fda9f7a7854",
    likes: 5,
    comments: 0,
  },
  {
    id: 3,
    username: "Daniel",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "3 dni temu",
    text: "Pobiłem rekord pajacyków 😎",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    likes: 45,
    comments: 11,
  },
];

export default function EntriesScreen() {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "20px" }}>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => navigate("/menu", { state: { statsMenu: true } })}
        >
          ← Powrót
        </Button>

        {mockEntries.map((entry) => (
          <Card
            key={entry.id}
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 16 }}
          >
            <Space>
              <Avatar src={entry.avatar} />
              <div>
                <strong>{entry.username}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{entry.time}</div>
              </div>
            </Space>

            <p style={{ marginTop: 12 }}>{entry.text}</p>

            <Image
              src={entry.image}
              style={{ maxHeight: 240, objectFit: "cover" }}
              width="100%"
              preview={false}
            />

            <Space size="large" style={{ marginTop: 12 }}>
              <span><LikeOutlined /> {entry.likes}</span>
              <span><MessageOutlined /> {entry.comments}</span>
              <span><ShareAltOutlined /> Udostępnij</span>
            </Space>
          </Card>
        ))}
      </Content>
    </Layout>
  );
}
