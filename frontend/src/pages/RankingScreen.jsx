
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from 'antd';  
import Ranking from '../components/Ranking';

const { useBreakpoint } = Grid;
const { Title } = Typography;


export default function RankingScreen() {
  const screens = useBreakpoint();
  
  const isMobile = !screens.md;
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        gap: "20px",
        padding: isMobile ? "16px" : "24px",
        paddingTop: "20px"
      }}
    >
      <div
        style={{
          margin: "0 auto",
          marginBottom: isMobile ? 12 : 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Link 
          to="/menu"
          state={{ statsMenu: true }}
        >
          <Button type="primary">← Powrót</Button>
        </Link>
        <Title
          level={isMobile ? 3 : 2}
          style={{ margin: 0, flex: 1, textAlign: isMobile ? "center" : "left" }}
        >
          Statystyki
        </Title>
      </div>
      <Ranking />
    </div>
  );
}
