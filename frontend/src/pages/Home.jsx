import { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, message } from "antd";
import LoginForm from "../components/Forms/LoginForm";
import RegisterForm from "../components/Forms/RegisterForm";
import { GiBodyBalance } from "react-icons/gi";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

export default function Home() {
  const [mode, setMode] = useState("login");
  const { login, register, user, error } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (user) {
      navigate("/menu");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      messageApi.error(error);
    }
  }, [error]);

  const handleSubmit = async (data) => {
    try {
      if (mode === "login") {
        await login(data);
      } else if (mode === "register") {
        await register(data);
      }
    } catch (err) {
      if (error) {
        messageApi.error(error);
      } else {
        messageApi.error("Wystąpił błąd. Spróbuj ponownie.");
      }
    }
  };

  return (
    <>
    {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
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
                {mode === "login" ? 
                  <LoginForm 
                    onSubmit={(values) => handleSubmit(values)}
                  /> 
                  : 
                  <RegisterForm 
                    onSubmit={(values) => handleSubmit(values)}
                  />
                }

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
    </>
  );
}
