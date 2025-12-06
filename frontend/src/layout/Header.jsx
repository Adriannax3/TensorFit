import { useAuth } from '../context/useAuth';
import { Button, Layout, Typography } from "antd";

const { Header } = Layout;
const { Text } = Typography;

export default function HeaderNav({ children }) {
    const { user, logout } = useAuth();

    if(!user) {
        return (
        <Header
            style={{
                background: "#7cacf8",
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                color: "#fff",
            }}
        >
            <Text strong style={{ fontSize: 26, color: "#fff"}}>TensorFit</Text>
        </Header>
        )
    }

    return (
        <Header
            style={{
                background: "#7cacf8",
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 12,
                paddingBottom: 12,
                height: "100%"
            }}
        >
            <Text strong style={{ fontSize: 26, color: "#fff"}}>TensorFit</Text>
            <Text
                style={{fontSize: 26, color: "#fff"}}>
                Witaj, {user.username}!
            </Text>
            <Button onClick={() => logout()}>
                Wyloguj się
            </Button>
        </Header>
    )
}
