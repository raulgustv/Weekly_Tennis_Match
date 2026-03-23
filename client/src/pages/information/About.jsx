import { Typography, Card, Flex, Divider, Image } from "antd";

const { Title, Paragraph, Text } = Typography;

const About = () => {
  return (
    <Flex justify="center" style={{ width: "100%" }}>
      <div style={{ maxWidth: 900, width: "100%" }}>
        
        {/* HERO */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <img
            src="https://res.cloudinary.com/rgustv-personal/image/upload/v1774014606/Public%20images/oy5kkzp33oz1quz71mrk.jpg"
            alt="tennis match"
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 16,
            }}
          />
          <Image />

          <Title level={2} style={{ textAlign: "center" }}>
            Madrid Tennis Community 🎾
          </Title>

          <Paragraph style={{ textAlign: "center" }}>
            A space where tennis meets community. Play, connect, and enjoy the
            game the way it’s meant to be.
          </Paragraph>
        </Card>

        {/* STORY */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <Title level={4}>Our Story</Title>

          <Paragraph>
            Madrid Tennis Community was created with a simple idea in mind:
            build a place where people can enjoy tennis in a relaxed, social and
            respectful environment.
          </Paragraph>

          <Paragraph>
            What started as a small group of players quickly grew into a
            community driven by shared passion for the game and the desire to
            make every match enjoyable — both on and off the court.
          </Paragraph>

          <Paragraph>
            Today, we focus on creating a space where everyone feels welcome,
            matches are easy to join, and the experience goes beyond just
            playing.
          </Paragraph>
        </Card>

        {/* VALUES */}
        <Card style={{ marginBottom: 24, borderRadius: 16 }}>
          <Title level={4}>What We Stand For</Title>

          <Flex vertical gap={8}>
            <Text>🎾 Good tennis</Text>
            <Text>🤝 Better company</Text>
            <Text>⚖️ Fair and transparent matches</Text>
            <Text>🍻 Social connection beyond the court</Text>
          </Flex>

          <Divider />

          <Paragraph>
            Whether you're here to compete or just have fun, the goal is simple:
            enjoy the game, meet great people, and keep coming back for more.
          </Paragraph>
        </Card>

        {/* CONTACT */}
        <Card style={{ borderRadius: 16 }}>
          <Title level={4}>Contact</Title>

          <Paragraph>
            Want to join or have any questions? We’d love to hear from you.
          </Paragraph>

          <Flex vertical gap={4}>
            <Text>📍 Madrid, Spain</Text>
            <Text>📧change@gmail.com</Text>
            <Text>📞 +34 600 123 456</Text>
          </Flex>

          <Divider />

          <Paragraph type="secondary">
            Let’s play, connect and grow the community together 🎾
          </Paragraph>
        </Card>
      </div>
    </Flex>
  );
};

export default About;