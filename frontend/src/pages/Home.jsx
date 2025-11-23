import { useState } from "react";
import { Layout, Row, Col, Card, Button, Image } from "antd";
import LoginForm from "../components/Forms/LoginForm";
import RegisterForm from "../components/Forms/RegisterForm";
import { GiBodyBalance } from "react-icons/gi";

const { Header, Content } = Layout;

export default function Home() {
  const [mode, setMode] = useState("login");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#7cacf8",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#fff",
        }}
      >
        TensorFit
      </Header>

      <Content style={{ padding: "20px", height: "calc(100vh - 64px)" }}>
        <Row gutter={16} style={{ height: "100%" }}>
          <Col span={12} style={{ height: "100%" }}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <GiBodyBalance size={250} color="#7cacf8" />
            </Card>
          </Col>

          <Col span={12} style={{ height: "100%" }}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {mode === "login" ? <LoginForm /> : <RegisterForm />}

              <div style={{ marginTop: 16, textAlign: "center" }}>
                {mode === "login" ? (
                  <>
                    <Button type="default" onClick={() => setMode("register")}>
                      Zarejestruj się
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="default" onClick={() => setMode("login")}>
                      Powrót do logowania
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
