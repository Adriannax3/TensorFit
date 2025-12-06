import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderNav from "./Header.jsx";
import AppFooter from "./Footer.jsx";

const { Content } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout>
        <HeaderNav />

        <Content>
        <Outlet />
        </Content>

        <AppFooter />
    </Layout>
    )
}
