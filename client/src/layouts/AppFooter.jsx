import { Layout, Typography } from "antd";
import TermsAndConditions from "../pages/auth/TermsAndConditions";
import { useState } from "react";

const { Footer } = Layout;
const { Link, Text } = Typography;


const AppFooter = () => {

  const [openModal, setOpenModal] = useState(false)

  return (
    <Footer
      style={{
        textAlign: "center",
        background: "#0B2C3D",
        padding: 0,
        lineHeight: 1.2
      }}
    >
      <Text style={{ color: "#CBD5F5" }}>
        © 2026 MTC Weekly Tennis App · All rights reserved
      </Text>

      <div style={{marginTop: 4}}>
        <Link onClick={() => setOpenModal(true)} style={{color: "#60A5FA"}}>
          Terms and Conditions 
        </Link>
        <TermsAndConditions open={openModal} setOpenModal={setOpenModal} readButton={false} closable={true} />
      </div>
    </Footer>
  )
}

export default AppFooter