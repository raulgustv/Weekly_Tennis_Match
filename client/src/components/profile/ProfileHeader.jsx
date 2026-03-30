import { Row, Col, Typography, Tag, Space } from "antd"
import ProfilePicture from "../uploads/ProfilePicture"
import dayjs from "dayjs";


const ProfileHeader = ({ user, editable }) => {

    const {Text, Title} = Typography;

    console.log(user)


    return (
        <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
                <ProfilePicture user={user} profilePicture={user?.profilePicture?.url} editable={editable} />
            </Col>

            <Col xs={24} sm={16} md={18}>
                <Title level={3} style={{ marginBottom: 8 }}>
                    {user?.name} {user?.lastname}
                </Title>

                <Space wrap size="middle">
                    <Tag color={user?.isActive ? "green" : "red"}>
                        {user?.isActive ? "Active user" : "Inactive user"}
                    </Tag>

                    <Tag color="gold">
                        NTRP Level: {user?.ntrplvl.toFixed(1)}
                    </Tag>
                </Space>

                <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    Member since {dayjs(user?.createdAt).format("DD-MM-YYYY")}
                </Text>
            </Col>
        </Row>
    )
}

export default ProfileHeader