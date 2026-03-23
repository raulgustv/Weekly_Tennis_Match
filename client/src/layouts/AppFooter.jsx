import { Layout, Typography, Flex } from "antd";
import TermsAndConditions from "../pages/auth/TermsAndConditions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Footer } = Layout;
const { Link, Text } = Typography;

const AppFooter = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  return (
    <Footer
      style={{
        background: "#0B2C3D",
        padding: "0 12px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Flex vertical align="center" gap={6}>
        
        {/* Texto principal */}
        <Text style={{ color: "#CBD5F5" }}>
          © 2026 MTC Weekly Tennis App · All rights reserved
        </Text>

        {/* Links */}
        <Flex gap={12} wrap="wrap" justify="center">
          
          <Link
            onClick={() => setOpenModal(true)}
            style={{ color: "#60A5FA" }}
          >
            Terms & Conditions
          </Link>

          <Text
            style={{ color: "#60A5FA", cursor: "pointer" }}
            onClick={() => navigate("/about")}
          >
            About Us
          </Text>

          <Text
            style={{ color: "#60A5FA", cursor: "pointer" }}
            onClick={() => navigate("/contact")}
          >
            Contact
          </Text>

        </Flex>

        {/* Modal */}
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