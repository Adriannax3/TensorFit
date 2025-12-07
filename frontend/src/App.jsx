import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./ProtectedRoute";

import WorkoutSession from "./pages/WorkoutSession";
import RankingScreen from "./pages/RankingScreen";
import StatisticsScreen from "./pages/StatisticsScreen";
import EntriesScreen from "./pages/Entries";
import MainLayout from "./layout/MainLayout";
import Account from "./pages/Account";

function App({ toggleTheme, isDark }) {
  const { user } = useAuth();

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:exerciseId"
            element={
              <ProtectedRoute>
                <WorkoutSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatisticsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <RankingScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entries"
            element={
              <ProtectedRoute>
                <EntriesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
