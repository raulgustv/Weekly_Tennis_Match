import { Layout } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AppFooter from "./AppFooter";

const { Header, Content } = Layout;

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.includes("/auth");

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#0B2C3D",
          color: "#fff",
          padding: "0 16px",
        }}
      >
        <div
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => navigate("/")}
        >
          🎾 MTC
        </div>
      </Header>

      {/* CONTENT 🔥 CLAVE */}
      <Content
        style={{
          flex: 1, // 🔥 ocupa todo el espacio disponible
          display: "flex",
          justifyContent: "center",
          alignItems: isAuthPage ? "center" : "flex-start",
          padding: 16,
          overflow: "auto", // 🔥 scroll SOLO aquí si hace falta
        }}
      >
        <div style={{ width: "100%", maxWidth: 900 }}>
          <Outlet />
        </div>
      </Content>

      {/* FOOTER 🔥 */}
      <AppFooter />
    </Layout>
  );
};

export default PublicLayout;