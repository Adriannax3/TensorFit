import { useState, useEffect } from "react";
import { Layout, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import EntryCard from "../components/EntryCard";

const { Content } = Layout;

export default function EntriesScreen() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("/entries/all");
        setEntries(res.data);
      } catch (err) {
        console.error("Błąd pobierania wpisów:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

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

        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
        ) : (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        )}
      </Content>
    </Layout>
  );
}
