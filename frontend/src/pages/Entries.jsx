import { useState, useEffect } from "react";
import { Layout, Button, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import EntryCard from "../components/EntryCard";

const { Content } = Layout;
const { Title } = Typography;

export default function EntriesScreen() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = 10;

  const fetchEntries = async (pageToLoad = 1, append = false) => {
    try {
      if (pageToLoad === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get("/entries/all", {
        params: { page: pageToLoad, limit },
      });

      const { entries: newEntries, pagination } = res.data;

      if (append) {
        setEntries((prev) => [...prev, ...newEntries]);
      } else {
        setEntries(newEntries);
      }

      setPage(pagination.page);
      setHasMore(pagination.page < pagination.totalPages);
    } catch (err) {
      console.error("Błąd pobierania wpisów:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEntries(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchEntries(page + 1, true);
  };
  
  const handleEntryDeleted = (deletedId) => {
    setEntries((prev) => prev.filter((e) => e.id !== deletedId));
  };
  
  const handleEntryUpdated = (updatedEntry) => {
    setEntries((prev) =>
      prev.map((e) =>
        String(e.id) === String(updatedEntry.id) ? { ...e, ...updatedEntry } : e
      )
    );
  };

  if(entries.length === 0 && !loading) {
    return (
      <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}> 
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => navigate("/menu", { state: { statsMenu: true } })}
        >
          ← Powrót
        </Button>
        <Title level={3}>Nikt jeszcze nie dodał żadnych wpisów.</Title>
      </Layout>
    );
  }

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
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : (
          <>
            {entries.map((entry) => (
              <EntryCard 
                key={entry.id} 
                entry={entry} 
                onDeleted={handleEntryDeleted} 
                onUpdated={handleEntryUpdated}
              />
            ))}

            {entries.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={handleLoadMore}
                  disabled={!hasMore}
                  loading={loadingMore}
                >
                  {hasMore ? "Załaduj więcej" : "Brak kolejnych wpisów"}
                </Button>
              </div>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
}
