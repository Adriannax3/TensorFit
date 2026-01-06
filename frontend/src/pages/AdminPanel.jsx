import { useEffect, useState } from "react";
import { Tabs, Card, Layout, Button, Spin, Alert, Typography } from "antd";
import EntriesAdmin from "../components/Admin/EntriesAdmin";
import UsersAdmin from "../components/Admin/UsersAdmin";
import CommentsAdmin from "../components/Admin/CommentsAdmin";
import { deleteEntry, toggleBlockUser, getUsers, getEntries, getAllComments, deleteComment } from "../services/api";
import { decodeImage } from "../utils/calculations";

const { Title } = Typography;

export default function AdminPanel() {

  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const [loadingEntries, setLoadingEntries] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const [entriesPage, setEntriesPage] = useState(1);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const entriesLimit = 25;

  const [statusMessage, setStatusMessage] = useState(null);
  const fetchEntries = async (page = 1) => {
    try {
      setLoadingEntries(true);
      const data = await getEntries(page, entriesLimit);
      console.log("Fetched entries:", data);
      if (data.entries.length < entriesLimit) setHasMoreEntries(false);
      if (page === 1) {
        setEntries(data.entries);
      } else {
        setEntries((prev) => [...prev, ...data.entries]);
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się pobrać wpisów" });
    } finally {
      setLoadingEntries(false);
    }
  };

  const loadMoreEntries = () => {
    if (!hasMoreEntries) return;
    const nextPage = entriesPage + 1;
    setEntriesPage(nextPage);
    fetchEntries(nextPage);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się pobrać użytkowników" });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getAllComments();
      setComments(data.comments);
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się pobrać komentarzy" });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
      setStatusMessage({ type: "success", text: "Wpis usunięty" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się usunąć wpisu" });
    }
  };

  const handleToggleBlockUser = async (id) => {
    try {
      const res = await toggleBlockUser(id);
      setUsers(users.map(u => u.id === id ? { ...u, isBlocked: res.isBlocked } : u));
      setStatusMessage({
        type: "success",
        text: `Użytkownik ${res.isBlocked ? "zablokowany" : "odblokowany"}`
      });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się zmienić statusu użytkownika" });
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      setComments(comments.filter(c => c.id !== id));
      setStatusMessage({ type: "success", text: "Komentarz usunięty" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Nie udało się usunąć komentarza" });
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchUsers();
    fetchComments();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", padding: 20 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Panel administratora</Title>
      <Card style={{ width: "100%", margin: "0 auto", padding: 16 }}>
        {statusMessage && (
          <Alert
            style={{ marginBottom: 16 }}
            type={statusMessage.type}
            message={statusMessage.text}
            showIcon
            closable
            onClose={() => setStatusMessage(null)}
          />
        )}
        <Tabs defaultActiveKey="posts">
          <Tabs.TabPane tab="Wpisy" key="posts">
            <EntriesAdmin
              entries={entries}
              loading={loadingEntries}
              onDelete={handleDeleteEntry}
              decodeImage={decodeImage}
            />
            {hasMoreEntries && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Button onClick={loadMoreEntries} loading={loadingEntries}>
                  Załaduj więcej wpisów
                </Button>
              </div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Użytkownicy" key="users">
            <UsersAdmin
              users={users}
              loading={loadingUsers}
              onToggleBlock={handleToggleBlockUser}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Komentarze" key="comments">
            <CommentsAdmin
              comments={comments}
              loading={loadingComments}
              onDelete={handleDeleteComment}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
}
