import { Col, Descriptions, Divider, Image, Row, Space, Tag, Timeline, Typography, Skeleton, Button, Progress } from "antd";
import { useAuth } from "../../context"
//import colors from "../../themes/colors";
import dayjs from "dayjs";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    GlobalOutlined,
    LockOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useCountries } from "../../hooks/useCountries";
import { useMemo } from "react";
import { useNTRPAdjustment } from "../../hooks/useNTRPAdjustment";
import { resetPasswordEmail } from "../../actions/auth";
import { toast } from 'react-toastify'
import useCountdown from "../../hooks/useCountdown";
import { formatTimeMs } from "../../helpers/time";
import ProfilePicture from "../../components/uploads/ProfilePicture";



const UserProfile = () => {

    const { user } = useAuth();

    console.log(user)

    const { countries } = useCountries();

    const total_cooldown = 120000

    const resetCooldown = useCountdown({
        duration: total_cooldown
    })

    const percent = resetCooldown.active
        ? 100 - Math.round((resetCooldown.remaining / total_cooldown) * 100)
        : 0;


    const { Text, Title } = Typography;

    const ntrpHistory = useNTRPAdjustment(user?.adjustmentHistory);

    const isLoading = !user || !countries || !ntrpHistory

    const countryFlag = useMemo(() => {
        if (!user?.country || !countries?.length) return null;

        return (
            countries.find(
                c => c.name?.toLowerCase() === user.country.toLowerCase()
            )?.flag || null
        );
    }, [user?.country, countries]);


    if (!user) return null;

    const handleSendReset = async (email) => {
        try {

            await resetPasswordEmail(email)

            toast.success(`Email sent to ${email}`)

            resetCooldown.start();

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    if (isLoading) {
        return (
            <>
                {/* Header skeleton */}
                <Row align="middle" gutter={24}>
                    <Col>
                        <Skeleton.Avatar active size={96} />
                    </Col>
                    <Col flex="auto">
                        <Skeleton.Input active style={{ width: 220 }} />
                        <Skeleton.Input
                            active
                            style={{ width: 160, marginTop: 8 }}
                        />
                    </Col>
                </Row>

                <Divider />

                {/* Personal info skeleton */}
                <Skeleton active paragraph={{ rows: 4 }} />

                <Divider />

                {/* Timeline skeleton */}
                <Skeleton active paragraph={{ rows: 3 }} />
            </>
        );
    }
    return (
        <>
            {/* ================= HEADER ================= */}

            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
                    {/* <Avatar
                        size={96}
                        style={{
                            backgroundColor: colors.green,
                            fontSize: 32,
                            fontWeight: "bold",
                        }}
                    >
                        {initials}
                    </Avatar> */}
                    <ProfilePicture user={user} profilePicture={user?.profilePicture?.url} />
                </Col>

                <Col xs={24} sm={16} md={18}>
                    <Title level={3} style={{ marginBottom: 8 }}>
                        {user.name} {user.lastname}
                    </Title>

                    <Space wrap size="middle">
                        <Tag color={user.isActive ? "green" : "red"}>
                            {user.isActive ? "Active user" : "Inactive user"}
                        </Tag>

                        <Tag color="gold">
                            NTRP Level: {user.ntrplvl.toFixed(1)}
                        </Tag>
                    </Space>

                    <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                        Member since {dayjs(user.createdAt).format("DD-MM-YYYY")}
                    </Text>
                </Col>
            </Row>

            <Divider />

            {/* ================= PERSONAL INFO ================= */}

            <Descriptions
                title="Personal information"
                bordered
                size="middle"
                column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
            >
                <Descriptions.Item
                    label={
                        <Space>
                            <MailOutlined /> Email
                        </Space>
                    }
                >
                    <Text>{user.email}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <MailOutlined /> Phone #
                        </Space>
                    }
                >
                    {user.phone || "-"}
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <LockOutlined /> Password
                        </Space>
                    }
                >
                    <div style={{ width: "100%" }}>
                        <Space wrap size="small">
                            <Text type="secondary">**************</Text>

                            <Button
                                size="small"
                                danger
                                onClick={() => handleSendReset(user?.email)}
                                disabled={resetCooldown.active}
                            >
                                {resetCooldown.active ? "Please wait" : "Change password"}
                            </Button>
                        </Space>

                        {resetCooldown.active && (
                            <div style={{ marginTop: 12 }}>
                                <Progress
                                    percent={percent}
                                    status="active"
                                    showInfo={false}
                                />

                                <Text
                                    type="danger"
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        fontSize: 12,
                                        marginTop: 6,
                                    }}
                                >
                                    Retry in {formatTimeMs(resetCooldown.remaining)}
                                </Text>
                            </div>
                        )}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <GlobalOutlined /> Country
                        </Space>
                    }
                >
                    <Space wrap>
                        <span>{user.country}</span>
                        {countryFlag && (
                            <Image src={countryFlag} width={22} preview={false} />
                        )}
                    </Space>
                </Descriptions.Item>
            </Descriptions>

            {/* ================= NTRP HISTORY ================= */}

            <Divider />

            <Title level={4}>NTRP History</Title>

            {ntrpHistory.length === 0 ? (
                <Text type="secondary">No NTRP Adjustments</Text>
            ) : (
                <Timeline
                    items={ntrpHistory.map((item) => {
                        const isUp = item.totalChange > 0;

                        return {
                            color: isUp ? "green" : "red",
                            icon: isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
                            content: (
                                <div>
                                    <small>{item.date}</small>
                                    <br />
                                    <Text strong type={isUp ? "success" : "warning"}>
                                        {isUp ? "+" : ""}
                                        {item.totalChange}
                                    </Text>
                                </div>
                            ),
                        };
                    })}
                />

            )}
        </>
    );

}

export default UserProfile