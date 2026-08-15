import {
    Row,
    Col,
    Typography,
    Tag,
    Space,
    Statistic,
} from "antd";
import ProfilePicture from "../uploads/ProfilePicture";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Timer } = Statistic;

const ProfileHeader = ({ user, editable }) => {

    const isSuspended =
        user?.suspendedUntil &&
        new Date(user.suspendedUntil) > new Date();

    return (
        <Row
            align="middle"
            gutter={[20, 16]}
            style={{
                width: "100%",
            }}
        >
            {/* PROFILE PICTURE */}
            <Col
                flex="0 0 110px"
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <ProfilePicture
                    user={user}
                    profilePicture={user?.profilePicture?.url}
                    editable={editable}
                />
            </Col>

            {/* PROFILE INFO */}
            <Col
                flex="1"
                style={{
                    minWidth: 0,
                }}
            >
                <Title
                    level={3}
                    style={{
                        margin: 0,
                        marginBottom: 8,
                        wordBreak: "break-word",
                    }}
                >
                    {user?.name} {user?.lastname}
                </Title>

                <Space
                    wrap
                    size={[8, 8]}
                    style={{
                        maxWidth: "100%",
                    }}
                >
                    <Tag
                        color={
                            user?.isActive
                                ? "green"
                                : "red"
                        }
                    >
                        {user?.isActive
                            ? "Active user"
                            : "Inactive user"}
                    </Tag>

                    <Tag color="gold">
                        NTRP Level:{" "}
                        {user?.ntrplvl?.toFixed(1)}
                    </Tag>

                    {isSuspended && (
                        <Tag
                            color="volcano"
                            style={{
                                fontSize: 14,
                                padding: "4px 12px",
                            }}
                        >
                            Temporarily Suspended
                        </Tag>
                    )}
                </Space>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 8,
                    }}
                >
                    Member since{" "}
                    {dayjs(user?.createdAt).format(
                        "DD-MM-YYYY"
                    )}
                </Text>

                {isSuspended && (
                    <div style={{ marginTop: 16 }}>
                        <Timer
                            title="Suspension ends in"
                            type="countdown"
                            value={
                                new Date(
                                    user.suspendedUntil
                                ).getTime()
                            }
                            format="D [days] H [hours] m [minutes] s"
                            onFinish={() => {
                                window.location.reload();
                            }}
                        />
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default ProfileHeader;