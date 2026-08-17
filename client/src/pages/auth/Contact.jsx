import { Typography, Card, Flex, Divider, Button } from "antd";
import { useFeedback } from "../../context/FeedbackContext";
import { useAuth } from "../../context";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const Contact = () => {

  const {user} = useAuth();
  const {triggerFeedbackCheck} = useFeedback();

  const handleFeedbackClick = ()=>{
    triggerFeedbackCheck('user_initiated', {}, 'app', 'Share your feedback')
  }

  return (
    <Flex justify="center" style={{ width: "100%" }}>
      <div style={{ maxWidth: 700, width: "100%" }}>

        {/* HEADER */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <Title level={2} style={{ textAlign: "center" }}>
            Contact Us 📩
          </Title>

          <Paragraph style={{ textAlign: "center" }}>
            Join the community, stay updated, and connect with other players.
          </Paragraph>
        </Card>

        {/* WHATSAPP */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <Title level={4}>WhatsApp Group</Title>

          <Paragraph>
            The fastest way to join matches and stay in the loop.
          </Paragraph>

          <a
            href="https://chat.whatsapp.com/XXXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#25D366", fontWeight: 500 }}
          >
            👉 Join our WhatsApp group
          </a>
        </Card>

        {/* SOCIAL MEDIA */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <Title level={4}>Social Media</Title>

          <Paragraph>
            Follow us for updates, match highlights and community moments.
          </Paragraph>

          <Flex vertical gap={8}>
            <a
              href="https://instagram.com/mtc.tennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              📸 Instagram
            </a>

            <a
              href="https://x.com/mtc_tennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 X (Twitter)
            </a>
          </Flex>
        </Card>

        {/* EMAIL */}
        <Card style={{ borderRadius: 16 }}>
          <Title level={4}>Email</Title>

          <Paragraph>
            For anything else, feel free to reach out directly.
          </Paragraph>

          <Text>📧 mtc.tennis.community@gmail.com</Text>

          <Divider />

          <Paragraph type="secondary">
            We usually reply within 24-48 hours.
          </Paragraph>
        </Card>

        {/* Feedback section */}
        <Card style={{borderRadius: 16}}>
          <Title level={4}>Feedback</Title>

          <Paragraph>
            Have thoughts on how to improve? Let us know.
          </Paragraph>

          {!user ? (
              <Link to='/auth'>Login to provide feedback</Link>
          ) : (
            <Button type="primary" onClick={handleFeedbackClick}>
             Give feedback 
          </Button>
          )}
        </Card>

      </div>
    </Flex>
  );
};

export default Contact;