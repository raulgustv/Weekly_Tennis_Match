import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Link, Text } = Typography;


const AppFooter = () => {
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

      <div style={{marginTop: 8}}>
        <Link href="/terms-and-conditions" style={{color: "#60A5FA"}}>
          Terms and conditions
        </Link>
      </div>
    </Footer>
  )
}

export default AppFooter