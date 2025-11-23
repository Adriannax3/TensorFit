import React from "react";
import { Row, Col, Button, Grid, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import ExerciseSummaryChart from "../components/Statistics/ExerciseSummaryChart";
import ExerciseHighlights from "../components/Statistics/ExerciseHighlights";

const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function StatisticsScreen() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const isMobile = !screens.md;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%)`,
        padding: isMobile ? "16px" : "24px",
      }}
    >
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
          Statystyki
        </Title>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 20, lg: 24 },
            { xs: 12, sm: 16, md: 20, lg: 24 },
          ]}
          align="stretch" 
        >
          <Col xs={24} lg={14} xl={15}>
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowTertiary,
                padding: isMobile ? 8 : 12,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ExerciseSummaryChart style={{ flex: 1 }} />
            </div>
          </Col>

          <Col xs={24} lg={10} xl={9}>
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowTertiary,
                padding: isMobile ? 8 : 12,
                height: "100%",
              }}
            >
              <ExerciseHighlights />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
