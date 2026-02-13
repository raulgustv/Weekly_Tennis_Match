import { Layout, Menu, Button, Grid, Dropdown } from "antd";
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
import { useState, useEffect } from "react";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(false);

  // auto collapse on mobile
  useEffect(() => {
    if (!screens.md) {
      setCollapsed(true);
    }
  }, [screens.md]);

  const menuItems = user?.role === 'admin' ? [
    {
      key: '/admin/dashboard',
      icon: <HomeOutlined />,
      label: 'Admin dashboard'

    },
    {
      key: '/games',
      icon: <DribbbleOutlined />,
      label: "Games"
    },
     {
      key: '/vote',
      icon: <FlagOutlined style={{color: '#0660c7'}} />,
      label: "Vote matches"
    }, 
    {
      key: '/admin-panel',
      icon: <CompassFilled style={{ color: "#46AF50" }} />,
      label: 'Admin Panel',
      children: [
        {
          key: '/admin/add-court',
          label: 'Add courts'
        }
      ]
    },
    {
      key: '/admin-matches',
      icon: <TrophyFilled style={{ color: "#deeb2c" }} />,
      label: "Match administration",
      children: [
        {
          key: '/admin/matches',
          label: 'New match'
        },
        {
          key: '/admin/view-matches',
          label: 'View matches'
        }
      ]
    },
    {
       key: '/admin-players',
      icon: <ContactsOutlined style={{ color: "#E74C3C" }} />,
      label: "User administration",
      children:[
        {
          key: '/admin/players',
          label: 'Players'
        },
        {
          key: '/profile',
          label: 'View admin profile'
        }
      ]
    }
  ] : [
      {
      key: '/games',
      icon: <DribbbleOutlined />,
      label: "Games"
    },
    {
      key: '/vote',
      icon: <FlagOutlined />,
      label: "Vote matches"
    },

    {
      key: '/profile  ',
      icon: <UserOutlined />,
      label: 'User Profile'
    }
  ]

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          logout();
          navigate('/login')
        }
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F7FA" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={screens.md ? 80 : 0}
        style={{
          background: "#0B2C3D", // azul noche
        }}
      >
        {/* LOGO */}
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
          style={{
            background: "#0B2C3D",
          }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* MAIN */}
      <Layout>
        {/* HEADER */}
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
          {/* MOBILE MENU BUTTON */}
          {!screens.md && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={{ color: "#fff" }}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}

          {/* TITLE */}
          <div
            style={{
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Madrid Tennis Community
          </div>

          {/* USER MENU */}
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
              {user?.name} {user?.lastname[0]}
            </Button>
          </Dropdown>

        </Header>

        {/* CONTENT */}
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
