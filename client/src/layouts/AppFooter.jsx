import { Layout, Typography, Flex } from "antd";
import TermsAndConditions from "../pages/auth/TermsAndConditions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Footer } = Layout;
const { Link, Text } = Typography;

const AppFooter = () => {
  const [openModal, setOpenModal] = useState(false);
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  const linkStyle = (key) => ({
    color: active === key ? "#FFFFFF" : "#60A5FA",
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: 8,
    fontWeight: active === key ? 600 : 400,
    background:
      active === key ? "rgba(96,165,250,0.20)" : "transparent",
    transition: "all .2s ease",
  });

  return (
    <Footer
      style={{
        background: "#0B2C3D",
        padding: "12px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Flex vertical align="center" gap={6}>
        <Text style={{ color: "#CBD5F5" }}>
          © 2026 MTC Weekly Tennis App · All rights reserved
        </Text>

        <Flex gap={12} wrap="wrap" justify="center">
          <Link
            onClick={() => {
              setActive("terms");
              setOpenModal(true);
            }}
            style={linkStyle("terms")}
          >
            Terms & Conditions
          </Link>

          <Text
            style={linkStyle("about")}
            onClick={() => {
              setActive("about");
              navigate("/about");
            }}
          >
            About Us
          </Text>

          <Text
            style={linkStyle("help")}
            onClick={() => {
              setActive("help");
              navigate("/help");
            }}
          >
            Help & FAQs
          </Text>

          <Text
            style={linkStyle("contact")}
            onClick={() => {
              setActive("contact");
              navigate("/contact");
            }}
          >
            Contact
          </Text>
        </Flex>

        <TermsAndConditions
          open={openModal}
          setOpenModal={setOpenModal}
          readButton={false}
          closable={true}
        />
      </Flex>
    </Footer>
  );
};

export default AppFooter;