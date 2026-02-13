import { Avatar, Col, Descriptions, Divider, Image, Row, Space, Tag, Timeline, Typography, Skeleton, Button, Progress } from "antd";
import { useAuth } from "../../context"
import colors from "../../themes/colors";
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



const UserProfile = () => {

    const { user } = useAuth();
    const { countries } = useCountries();

    const total_cooldown = 120000

    const resetCooldown = useCountdown({
        duration: total_cooldown
    })

    const percent = resetCooldown.active
        ? 100 - Math.round((resetCooldown.remaining / total_cooldown) * 100)
        : 0;


    const { Text, Title } = Typography;

    const ntrpHistory = useNTRPAdjustment(user.adjustmentHistory);

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

    const initials = `${user.name?.[0] || ""}${user.lastname?.[0] || ""}`

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
            <Row align="middle" gutter={24}>
                <Col>
                    <Avatar size={96} style={{
                        backgroundColor: colors.green,
                        fontsize: 32,
                        fontWeight: "bold"
                    }}>
                        {initials}
                    </Avatar>
                </Col>

                <Col flex="auto">
                    <Title level={3}>
                        {user.name} {user.lastname}
                    </Title>

                    <Space size="middle" wrap>
                        <Tag color={user.isActive ? 'green' : 'red'}>
                            {user.isActive ? 'Active user' : 'Inactive user'}
                        </Tag>
                        <Tag color="gold">
                            NTRP Level: {user.ntrplvl.toFixed(1)}
                        </Tag>
                    </Space>

                    <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                        Member since {dayjs(user.createdAt).format("DD-MM-  YYYY")}
                    </Text>
                </Col>
            </Row>

            <Divider />

            {/* Personal info */}

            <Descriptions title="Personal information" bordered column={{ xs: 1, sm: 2, md: 4, lg: 8 }}>
                {/* EMAIL */}
                <Descriptions.Item
                    span={1}
                    label={
                        <Space>
                            <MailOutlined /> Email
                        </Space>
                    }
                >
                    {user.email}
                </Descriptions.Item>

                {/* PHONE */}
                <Descriptions.Item
                    label={
                        <Space>
                            <MailOutlined /> Phone #
                        </Space>
                    }
                >
                    {user.phone || "-"}
                </Descriptions.Item>

                {/* PASSWORD — JUSTO DEBAJO DE PHONE */}
                <Descriptions.Item
                    label={
                        <Space>
                            <LockOutlined /> Password
                        </Space>
                    }
                >
                    <Space>
                        <Text type="secondary">**************</Text>
                        <Button
                            size="small"
                            danger
                            onClick={() => { handleSendReset(user?.email) }}
                            disabled={resetCooldown.active}
                        >
                            {resetCooldown.active ? "Please wait" : "Change password"}
                        </Button>

                        {
                            resetCooldown.active && (
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
                                            marginTop: 6,
                                            fontsize: 12
                                        }}
                                    >
                                        Retry in {formatTimeMs(resetCooldown.remaining)}
                                    </Text>
                                </div>
                            )
                        }
                    </Space>
                </Descriptions.Item>

                {/* COUNTRY */}
                <Descriptions.Item
                    span={1}
                    label={
                        <Space>
                            <GlobalOutlined /> Country
                        </Space>
                    }
                >
                    <Space>
                        <span>{user.country}</span>
                        {countryFlag && (
                            <Image src={countryFlag} width={22} preview={false} />
                        )}
                    </Space>
                </Descriptions.Item>
            </Descriptions>


            {/* Tennis history */}

            <Divider />

            <Title level={4}>NTRP History</Title>

            {ntrpHistory.length === 0 ? (
                <Text type="secondary">No NTRP Adjustments</Text>
            ) :
                (
                    <Timeline
                        items={ntrpHistory.map((item) => {
                            const isUp = item.totalChange > 0;
                            //const isDown = item.totalChange < 0;

                            return {
                                color: isUp ? "green" : "red",
                                icon: isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
                                content: (
                                    <Space orientation="vertical" size={0}>
                                        <small>{item.date + " "}</small>
                                        <Text strong type={isUp ? "success" : "warning"}>
                                            {isUp ? "+" : ""}({item.totalChange})
                                        </Text>
                                    </Space>
                                )
                            }

                        })}
                    />
                )}



        </>
    )
}

export default UserProfile