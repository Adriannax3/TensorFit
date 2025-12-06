import { Layout } from "antd";

const { Footer } = Layout;

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer
      style={{
        background: "#7cacf8",
        fontSize: 14,
        textAlign: "center",
        color: "#eee",
        userSelect: "none",
      }}
    >
      © 2025 – {currentYear} TensorFit
    </Footer>
  );
}
