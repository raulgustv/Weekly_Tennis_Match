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
  RiseOutlined,
  CalendarOutlined,
  CloseOutlined, // [NUEVO] icono de cierre blanco para el Drawer móvil
} from "@ant-design/icons";

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context";
import { useEffect, useRef, useState } from "react"; // [CAMBIO] añadido useRef

import "../styles/menu.css";
import "../styles/LayoutAll.css"; // [NUEVO] estilos de accesibilidad (skip link, foco)

import AppFooter from "./AppFooter";
import { useFeedback } from "../context/FeedbackContext";
import Notifications from "../components/notifications/Notifications";
import AlertNotVerified from "../components/utils/AlertNotVerified";
import VerifyAccountModal from "../components/modals/VerifyAccountModal";
import TermsUpdateModal from "../components/modals/TermsUpdateModal";


const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

// [NUEVO] Rutas que no están en el menú pero pertenecen a una sección del menú.
// SUPUESTO: el detalle de un partido se abre desde "Games". Si no es así, cambia o borra esta línea.
const ROUTE_ALIASES = [["/match/details", "/games"]];

// [NUEVO] Clave del menú para guardar si el usuario colapsó la barra lateral
const SIDER_COLLAPSED_KEY = "mtc_sider_collapsed";

// [NUEVO] Devuelve solo las claves de los items que son ruta (hojas del menú)
const collectLeafKeys = (items) =>
  items.flatMap((item) =>
    item.children ? collectLeafKeys(item.children) : [item.key]
  );

// [NUEVO] Elige qué item del menú resaltar según la URL actual.
// Antes: selectedKeys={[location.pathname]} → en rutas como /admin/seasons/123/rounds no se resaltaba nada.
// Ahora: gana la clave más larga que sea prefijo de la ruta.
const getSelectedKey = (pathname, menuItems) => {
  const aliased = ROUTE_ALIASES.find(
    ([from]) => pathname === from || pathname.startsWith(`${from}/`)
  );
  if (aliased) return aliased[1];

  const matches = collectLeafKeys(menuItems).filter(
    (key) =>
      typeof key === "string" &&
      key.startsWith("/") &&
      (pathname === key || pathname.startsWith(`${key}/`))
  );

  return matches.sort((a, b) => b.length - a.length)[0];
};

const MainLayout = () => {
  const { user, logout, justRegistered, dismissJustRegistered, loadUser, termsUpdateRequired, currentTermsVersion } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // [CAMBIO] recuerda si el usuario colapsó la barra lateral (try/catch: el almacenamiento puede estar bloqueado)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDER_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const { triggerFeedbackCheck } = useFeedback();

  // [NUEVO] true hasta que termina el primer render (para no robar el foco al cargar la app)
  const isFirstRender = useRef(true);

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

  // [NUEVO] ACCESIBILIDAD: al cambiar de página, mueve el foco al contenido principal y sube al inicio.
  // Sin esto, quien navega con teclado o lector de pantalla se queda en el menú y no sabe que la página cambió.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // [NUEVO] guarda la preferencia de colapsar la barra lateral
  const handleCollapse = (value) => {
    setCollapsed(value);
    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, value ? "1" : "0");
    } catch {
      // sin almacenamiento: la preferencia simplemente no se recuerda
    }
  };

  // [NUEVO] el skip link no usa el hash de la URL (con BrowserRouter ensuciaría la ruta)
  const handleSkipToContent = (event) => {
    event.preventDefault();
    document.getElementById("main-content")?.focus();
  };

  const isAdmin = user?.role === "admin";
  const isBooker = user?.role === "booker";

  // [NUEVO] nombre completo para etiquetas accesibles
  const fullName = [user?.name, user?.lastname].filter(Boolean).join(" ") || "User";

  const rankingMenuItem = {
    key: '/ranking',
    icon: (
      <RiseOutlined />
    ),
    label: 'Singles Ranking'
  }

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
      rankingMenuItem,
      {
        key: 'admin-ranking',
        icon: (<CalendarOutlined style={{ color: "#F4D03F" }} />),
        label: 'Ranking Administration',
        children: [
          {
            key: '/admin/new-season',
            label: 'Create new season'
          },
          {
            key: '/admin/seasons',
            label: 'Seasons'
          }
        ]
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
        rankingMenuItem,
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
        rankingMenuItem,
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

  // [NUEVO] item resaltado según la URL, y submenú que debe estar abierto para que se vea
  const selectedKey = getSelectedKey(location.pathname, menuItems);
  const openKeys = menuItems
    .filter((item) => item.children?.some((child) => child.key === selectedKey))
    .map((item) => item.key);

  const userMenu = {
    items: [
      // [NUEVO] acceso rápido al perfil desde el menú de usuario
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "My profile",
        onClick: () => navigate("/profile"),
      },
      { type: "divider" }, // [NUEVO]
      {
        key: "logout",
        icon: (
          <LogoutOutlined style={{ color: "#FF4D4F" }} />
        ),
        label: "Logout",
        onClick: () => {
          logout();
          // [CAMBIO] antes navigate("/login"), ruta que no existe (acababa en /auth por el comodín).
          // Ahora va directo a /auth.
          navigate("/auth");
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

  // [NUEVO] logo reutilizado en la barra lateral. El emoji lleva etiqueta para lectores de pantalla.
  const brandLogo = (
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
      <span role="img" aria-label="Tennis ball">🎾</span> MTC
    </div>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
      }}
    >
      {/* [NUEVO] SKIP LINK: primer elemento enfocable de la página. Permite saltar el menú con el teclado. */}
      <a href="#main-content" className="skip-link" onClick={handleSkipToContent}>
        Skip to main content
      </a>

      {/* ================= SIDEBAR ================= */}

      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={handleCollapse} // [CAMBIO] antes setCollapsed
          width={220}
          style={{
            background: "#0B2C3D",
          }}
        >
          {brandLogo}

          {/* [NUEVO] <nav> con nombre: los lectores de pantalla lo anuncian como zona de navegación */}
          <nav aria-label="Main navigation">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []} // [CAMBIO] antes [location.pathname]
              defaultOpenKeys={collapsed ? [] : openKeys} // [NUEVO] abre el submenú de la página actual
              style={{
                background: "#0B2C3D",
              }}
              items={menuItems}
              onClick={({ key }) => handleNavigate(key)}
            />
          </nav>
        </Sider>
      )}

      {/* ================= MOBILE DRAWER ================= */}

      {isMobile && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          // [NUEVO] título con el logo + botón de cierre visible y en blanco (antes no tenía cabecera)
          title={
            <span style={{ color: "#F4D03F", fontWeight: "bold" }}>
              <span role="img" aria-label="Tennis ball">🎾</span> MTC
            </span>
          }
          closeIcon={<CloseOutlined style={{ color: "#fff" }} aria-label="Close navigation menu" />}
          size={280} // [NUEVO] ancho fijo cómodo en móvil
          styles={{
            // [NUEVO] cabecera con el mismo fondo oscuro del menú
            header: {
              background: "#0B2C3D",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            },
            body: {
              padding: 0,
              background: "#0B2C3D",
            },
          }}
        >
          <nav aria-label="Main navigation">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []} // [CAMBIO] antes [location.pathname]
              defaultOpenKeys={openKeys} // [NUEVO]
              style={{
                background: "#0B2C3D",
              }}
              items={menuItems}
              onClick={({ key }) => handleNavigate(key)}
            />
          </nav>
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
            // [NUEVO] cabecera fija: el menú y el perfil siempre quedan a mano al hacer scroll
            position: "sticky",
            top: 0,
            zIndex: 100,
            width: "100%",
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
                className="main-header-btn" // [NUEVO] contorno de foco visible
                // [NUEVO] el botón solo tenía un icono: ahora tiene nombre accesible y estado
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
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
                  width: 44, // [CAMBIO] antes 38: objetivo táctil de 44px
                  height: 44,
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
                className="main-header-btn" // [NUEVO]
                // [NUEVO] en móvil solo se ve un icono: sin esto el botón no tenía nombre
                aria-label={`Account menu for ${fullName}`}
                aria-haspopup="menu"
                style={{
                  height: 44, // [CAMBIO] antes 38
                  minWidth: 44, // [NUEVO]
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
          // [NUEVO] destino del skip link y del foco al cambiar de página
          // (Content ya se pinta como <main>, el landmark de contenido principal)
          id="main-content"
          tabIndex={-1}
          style={{
            flex: 1,
            // [CAMBIO] en móvil menos margen y padding para aprovechar la pantalla (antes 16 y 16 siempre)
            margin: isMobile ? 8 : 16,
            padding: isMobile ? 12 : 16,
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

          <TermsUpdateModal
              open={termsUpdateRequired}
              currentVersion={currentTermsVersion}
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