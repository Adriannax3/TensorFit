import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Space,
  Input,
  Button,
  Form,
  Typography,
  Divider,
  Modal,
  ColorPicker,
  theme,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SyncOutlined,
} from "@ant-design/icons";
import axios from "../axios";
import { useAuth } from "../context/useAuth";

const { Title, Text } = Typography;

export default function MyAccount() {
  const { token } = theme.useToken();
  const auth = useAuth();
  const user = auth?.user || null;
  const setUser = auth?.setUser;

  const [loadingUser, setLoadingUser] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || "#ccc");
  const [error, setError] = useState(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAvatarColor(user.avatarColor || "#ccc");
    }
  }, [user]);

  const fetchMe = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("/users/me");
      const u = res.data;
      setUsername(u.username || "");
      setEmail(u.email || "");
      setAvatarColor(u.avatarColor || "#ccc");

      if (setUser) {
        setUser(u);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Nie udało się pobrać danych użytkownika");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, []);

  if (!user && !loadingUser) {
    return (
      <Card>
        <Text>Musisz być zalogowany, aby zobaczyć swoje konto.</Text>
      </Card>
    );
  }

  const handleStartEdit = () => {
    setError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAvatarColor(user.avatarColor || "#ccc");
    }
    setError(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("Nazwa użytkownika nie może być pusta");
      return;
    }

    try {
      setSavingProfile(true);
      setError(null);

      const res = await axios.put("/users/me", {
        username: trimmedUsername,
        avatarColor,
      });

      const updatedUser = res.data.user || res.data;

      setUsername(updatedUser.username || trimmedUsername);
      setAvatarColor(updatedUser.avatarColor || avatarColor);

      if (setUser) {
        setUser(updatedUser);
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      const msg =
        err?.response?.data?.error || "Nie udało się zaktualizować profilu";
      setError(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const openPasswordModal = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (!changingPassword) {
      setPasswordModalOpen(false);
      setPasswordError("");
    }
  };

  const generateStrongPassword = () => {
    const length = 12;
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const special = "!@#$%^&*?";

    const all = lowercase + uppercase + digits + special;

    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    const array = password.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    const finalPassword = array.join("");

    setNewPassword(finalPassword);
    setConfirmNewPassword(finalPassword);
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Wszystkie pola muszą być wypełnione");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Nowe hasła nie są takie same");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Nowe hasło musi mieć co najmniej 8 znaków");
      return;
    }

    try {
      setChangingPassword(true);
      await axios.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setPasswordModalOpen(false);
      setPasswordError("");
    } catch (err) {
      console.error("Error changing password:", err);
      const msg =
        err?.response?.data?.error || "Nie udało się zmienić hasła";
      setPasswordError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const avatarBg = avatarColor || token.colorPrimary;
  const initial = (username || email || "?")[0];

  return (
    <>
      <Card
        loading={loadingUser}
        style={{ maxWidth: 600, margin: "0 auto" }}
        styles={{ body: { padding: 24 } }}
      >
        <Space
          align="start"
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space align="center">
            <Avatar
              size={64}
              style={{
                backgroundColor: avatarBg,
                fontSize: 28,
              }}
            >
              {initial}
            </Avatar>
            <div>
              <Title level={4} style={{ marginBottom: 4 }}>
                Moje konto
              </Title>
              <Text type="secondary">Zarządzaj swoim profilem i hasłem</Text>
            </div>
          </Space>

          <Space>
            {!isEditing ? (
              <Button
                icon={<EditOutlined />}
                onClick={handleStartEdit}
                size="middle"
              >
                Edytuj profil
              </Button>
            ) : (
              <>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancelEdit}
                  size="middle"
                >
                  Anuluj
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveProfile}
                  loading={savingProfile}
                  size="middle"
                >
                  Zapisz
                </Button>
              </>
            )}
          </Space>
        </Space>

        <Divider />

        <Form layout="vertical">
          <Form.Item label="Adres e-mail">
            <Input value={email} disabled />
          </Form.Item>

          <Form.Item label="Nazwa użytkownika">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              maxLength={32}
              placeholder="Wpisz nazwę użytkownika"
            />
          </Form.Item>

          <Form.Item label="Kolor avatara">
            <Space align="center">
              <ColorPicker
                disabled={!isEditing}
                value={avatarColor}
                onChange={(_, hex) => setAvatarColor(hex)}
              />
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: avatarBg,
                  border: "1px solid rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {initial}
              </div>
            </Space>
          </Form.Item>

          {error && (
            <div style={{ color: "red", marginTop: 8 }}>{error}</div>
          )}
        </Form>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={5}>Bezpieczeństwo</Title>
          <Text type="secondary">
            Regularnie zmieniaj hasło, aby zwiększyć bezpieczeństwo konta.
          </Text>
          <Button
            icon={<KeyOutlined />}
            onClick={openPasswordModal}
            style={{ marginTop: 8 }}
          >
            Zmień hasło
          </Button>
        </Space>
      </Card>

      <Modal
        title="Zmień hasło"
        open={passwordModalOpen}
        onCancel={closePasswordModal}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Wpisz stare hasło">
            <Input.Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Stare hasło"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <span>Wpisz nowe hasło</span>
                <Button
                  size="small"
                  type="link"
                  icon={<SyncOutlined />}
                  onClick={generateStrongPassword}
                >
                  Wygeneruj hasło
                </Button>
              </Space>
            }
          >
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nowe hasło"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item label="Potwierdź nowe hasło">
            <Input.Password
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Powtórz nowe hasło"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {passwordError && (
            <div style={{ color: "red", marginBottom: 12 }}>
              {passwordError}
            </div>
          )}

          <Space
            style={{ width: "100%", justifyContent: "flex-end", marginTop: 8 }}
          >
            <Button onClick={closePasswordModal} disabled={changingPassword}>
              Anuluj
            </Button>
            <Button
              type="primary"
              loading={changingPassword}
              onClick={handleChangePassword}
            >
              Zapisz nowe hasło
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
