import {
  Layout,
  Menu,
  Button,
  Grid,
  Dropdown,
  Drawer,
} from "antd";

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
  WalletOutlined,
  BellOutlined,
} from "@ant-design/icons";

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context";
import { useEffect, useState } from "react";

import "../styles/menu.css";

import AppFooter from "./AppFooter";
import { useFeedback } from "../context/FeedbackContext";
import Notifications from "../components/notifications/Notifications";
import AlertNotVerified from "../components/utils/AlertNotVerified";
import VerifyAccountModal from "../components/modals/VerifyAccountModal";


const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const { user, logout, justRegistered, dismissJustRegistered, loadUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { triggerFeedbackCheck } = useFeedback();

  useEffect(() => {
    if (user) {
      triggerFeedbackCheck(
        "usage_milestone",
        {},
        "app",
        "How is the experience so far?"
      );
    }
  }, [user, triggerFeedbackCheck]);

  const isAdmin = user?.role === "admin";
  const isBooker = user?.role === "booker";

  const menuItems = isAdmin
    ? [
        {
          key: "/admin/dashboard",
          icon: (
            <HomeOutlined style={{ color: "#4DA3FF" }} />
          ),
          label: "Admin dashboard",
        },
        {
          key: "/games",
          icon: (
            <DribbbleOutlined style={{ color: "#52C41A" }} />
          ),
          label: "Games",
        },
        {
          key: "/vote",
          icon: (
            <FlagOutlined style={{ color: "#1677FF" }} />
          ),
          label: "Vote matches",
        },
        {
          key: "/manage-courts",
          icon: (
            <CompassFilled style={{ color: "#13C2C2" }} />
          ),
          label: "Manage courts",
          children: [
            {
              key: "/admin/add-court",
              label: "Add & manage courts",
            },
          ],
        },
        {
          key: "/admin-matches",
          icon: (
            <TrophyFilled style={{ color: "#FADB14" }} />
          ),
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
          icon: (
            <ContactsOutlined style={{ color: "#FF7875" }} />
          ),
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
        {
          key: "/admin-wallet",
          icon: (
            <WalletOutlined style={{ color: "#e7eb6d" }} />
          ),
          label: "Wallet administration",
          children: [
            {
              key: "/admin/transactions",
              label: "Transaction admin",
            },
            {
              key: "/wallet",
              label: "View wallet",
            },
          ],
        },
        {
          key: "/notifications",
          icon: (
            <BellOutlined style={{ color: "#8B5CF6" }} />
          ),
          label: "Manage Notifications",
          children: [
            {
              key: "/admin/notifications",
              label: "Create a notification",
            },
          ],
        },
      ]
    : isBooker
    ? [
        {
          key: "/games",
          icon: (
            <DribbbleOutlined style={{ color: "#52C41A" }} />
          ),
          label: "Games",
        },
        {
          key: "/vote",
          icon: (
            <FlagOutlined style={{ color: "#1677FF" }} />
          ),
          label: "Vote matches",
        },
        {
          key: "/admin-matches",
          icon: (
            <TrophyFilled style={{ color: "#FADB14" }} />
          ),
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
          key: "/profile",
          icon: (
            <UserOutlined style={{ color: "#9254DE" }} />
          ),
          label: "User Profile",
        },
        {
          key: "/wallet",
          icon: (
            <WalletOutlined style={{ color: "#e7eb6d" }} />
          ),
          label: "Wallet administration",
        },
      ]
    : [
        {
          key: "/games",
          icon: (
            <DribbbleOutlined style={{ color: "#52C41A" }} />
          ),
          label: "Games",
        },
        {
          key: "/vote",
          icon: (
            <FlagOutlined style={{ color: "#1677FF" }} />
          ),
          label: "Vote matches",
        },
        {
          key: "/profile",
          icon: (
            <UserOutlined style={{ color: "#9254DE" }} />
          ),
          label: "User Profile",
        },
        {
          key: "/wallet",
          icon: (
            <WalletOutlined style={{ color: "#e7eb6d" }} />
          ),
          label: "Wallet administration",
        },
      ];

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: (
          <LogoutOutlined style={{ color: "#FF4D4F" }} />
        ),
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

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
      }}
    >
      {/* ================= SIDEBAR ================= */}

      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            background: "#0B2C3D",
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
            style={{
              background: "#0B2C3D",
            }}
            items={menuItems}
            onClick={({ key }) => handleNavigate(key)}
          />
        </Sider>
      )}

      {/* ================= MOBILE DRAWER ================= */}

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
            style={{
              background: "#0B2C3D",
            }}
            items={menuItems}
            onClick={({ key }) => handleNavigate(key)}
          />
        </Drawer>
      )}

      {/* ================= MAIN ================= */}

      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ================= HEADER ================= */}

        <Header
          style={{
            padding: isMobile ? "0 12px" : "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            background:
              "linear-gradient(90deg, #0B2C3D 0%, #1E7F43 100%)",
            color: "#fff",
          }}
        >
          {/* LEFT */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            {isMobile && (
              <Button
                type="text"
                icon={
                  <MenuOutlined
                    style={{
                      color: "#fff",
                      fontSize: 18,
                    }}
                  />
                }
                onClick={() => setMobileOpen(true)}
                style={{
                  width: 38,
                  height: 38,
                  padding: 0,
                }}
              />
            )}

            <div
              style={{
                fontWeight: 600,
                fontSize: isMobile ? 14 : 15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Madrid Tennis Community
            </div>
          </div>

          {/* RIGHT ACTIONS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Notifications
              user={user}
              isMobile={isMobile}
            />

            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                style={{
                  height: 38,
                  color: "#fff",
                  borderRadius: 10,
                  padding: isMobile
                    ? "0 8px"
                    : "0 12px",
                  background:
                    "rgba(255,255,255,0.08)",
                }}
              >
                <UserOutlined />

                {!isMobile && (
                  <span>
                    {user?.name}{" "}
                    {user?.lastname?.[0]}
                  </span>
                )}
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* ================= CONTENT ================= */}

        <Content
          style={{
            flex: 1,
            margin: 16,
            padding: 16,
            background: "#fff",
            borderRadius: 8,
            overflow: "auto",
          }}
        >
          {/* ALERTA AQUI */}
          <AlertNotVerified name={user?.name} email={user?.email} isVerified={user?.isVerified} />

          {/* MODAL AUTOMÁTICO POST-REGISTRO, se muestra 1 sola vez */}
          <VerifyAccountModal
            open={justRegistered && !user?.isVerified}
            onClose={dismissJustRegistered}
            email={user?.email}
            onVerified={async () => {
              dismissJustRegistered();
              await loadUser();
            }}
          />

          <Outlet />
        </Content>

        {/* ================= FOOTER ================= */}

        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;