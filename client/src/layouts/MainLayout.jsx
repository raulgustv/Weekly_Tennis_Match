import { Layout, Menu, Button, Grid, Dropdown, Drawer } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  TrophyFilled,
  CompassFilled,
  FlagOutlined,
  ContactsOutlined,
  HomeOutlined,
  DribbbleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { useState } from "react";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const { user, logout } = useAuth();
  //console.log(user)
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems =
    user?.role === "admin"
      ? [
        {
          key: "/admin/dashboard",
          icon: <HomeOutlined />,
          label: "Admin dashboard",
        },
        {
          key: "/games",
          icon: <DribbbleOutlined />,
          label: "Games",
        },
        {
          key: "/vote",
          icon: <FlagOutlined style={{ color: "#0660c7" }} />,
          label: "Vote matches",
        },
        {
          key: "/manage-courts",
          icon: <CompassFilled style={{ color: "#46AF50" }} />,
          label: "Manage courts",
          children: [
            {
              key: "/admin/add-court",
              label: "Add courts",
            },
          ],
        },
        {
          key: "/admin-matches",
          icon: <TrophyFilled style={{ color: "#deeb2c" }} />,
          label: "Match administration",
          children: [
            {
              key: "/admin/matches",
              label: "New match",
            },
            {
              key: "/admin/view-matches",
              label: "View matches",
            },
          ],
        },
        {
          key: "/admin-players",
          icon: <ContactsOutlined style={{ color: "#E74C3C" }} />,
          label: "User administration",
          children: [
            {
              key: "/admin/players",
              label: "Players",
            },
            {
              key: "/profile",
              label: "View admin profile",
            },
          ],
        },
      ]
      : [
        {
          key: "/games",
          icon: <DribbbleOutlined />,
          label: "Games",
        },
        {
          key: "/vote",
          icon: <FlagOutlined />,
          label: "Vote matches",
        },
        {
          key: "/profile",
          icon: <UserOutlined />,
          label: "User Profile",
        },
      ];

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          logout();
          navigate("/login");
        },
      },
    ],
  };

  const handleNavigate = (key) => {
    navigate(key);
    if (isMobile) setMobileOpen(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F7FA" }}>
      {/* ===== DESKTOP SIDER ===== */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{ background: "#0B2C3D" }}
        >
          <div
            style={{
              height: 48,
              margin: 16,
              color: "#F4D03F",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            🎾 MTC
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ background: "#0B2C3D" }}
            items={menuItems}
            onClick={({ key }) => handleNavigate(key)}
          />
        </Sider>
      )}

      {/* ===== MOBILE DRAWER ===== */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          styles={{
            body: {
              padding: 0,
              background: "#0B2C3D",
            },
          }}
        >
          <div
            style={{
              height: 48,
              margin: 16,
              color: "#F4D03F",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            🎾 MTC
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ background: "#0B2C3D" }}
            items={menuItems}
            onClick={({ key }) => handleNavigate(key)}
          />
        </Drawer>
      )}

      {/* ===== MAIN ===== */}
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(90deg, #0B2C3D 0%, #1E7F43 100%)",
            color: "#fff",
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={{ color: "#fff" }}
              onClick={() => setMobileOpen(true)}
            />
          )}

          <div style={{ fontWeight: "bold", letterSpacing: 1 }}>
            Madrid Tennis Community
          </div>

          <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
            <Button
              type="text"
              style={{
                color: "#fff",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <UserOutlined />
              {user?.name} {user?.lastname?.[0]}
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 16,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;