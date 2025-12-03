import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderNav from "./Header.jsx";

const { Footer, Content } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout>
        <HeaderNav />

        <Content>
        <Outlet />
        </Content>

        <Footer>FOOTER</Footer>
    </Layout>
    )
}
