import { Layout, Button, Grid, Typography } from "antd";
import MyAccount from "../components/MyAccount";
import { useNavigate } from "react-router";

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function Account() { 
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  const isMobile = !screens.md;
  
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", flexDirection: "column" }}>
      <Content style={{ padding: "20px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            marginBottom: isMobile ? 12 : 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Button
            type="primary"
            onClick={() => navigate("/menu", { state: { statsMenu: true } })}
          >
            ← Powrót
          </Button>
  
          <Title
            level={isMobile ? 3 : 2}
            style={{ margin: 0, flex: 1, textAlign: isMobile ? "center" : "left" }}
          >
            Moje konto
          </Title>
        </div>
        <MyAccount />
      </Content>
    </Layout>
  );
}