import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

// pages
import WorkoutSession from "./pages/WorkoutSession";
import RankingScreen from "./pages/RankingScreen";
import StatisticsScreen from "./pages/StatisticsScreen";

function App({ toggleTheme, isDark }) {
  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={toggleTheme}
        icon={isDark ? <MoonOutlined /> : <SunOutlined />}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/session/:exerciseId" element={<WorkoutSession />} />
        <Route path="/stats" element={<StatisticsScreen />} />
        <Route path="/ranking" element={<RankingScreen />} />
      </Routes>
    </>
  );
}

export default App;
