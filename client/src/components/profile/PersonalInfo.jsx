import useCountdown from "../../hooks/useCountdown";
import { Descriptions, Image, Space, Typography, Button, Progress, Tooltip } from "antd";
import {
    GlobalOutlined,
    InfoCircleOutlined,
    LockOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { formatTimeMs } from "../../helpers/time";
import { useCountries } from "../../hooks/useCountries";
import { useMemo } from "react";


const PersonalInfo = ({ user, handleSendReset = null, passwordChange }) => {

    const { Text, Link } = Typography;

    const { countries } = useCountries()

    const total_cooldown = 120000

    const resetCooldown = useCountdown({
        duration: total_cooldown
    })

    const countryFlag = useMemo(() => {
        if (!user?.country || !countries?.length) return null;

        return (
            countries.find(
                c => c.name?.toLowerCase() === user.country.toLowerCase()
            )?.flag || null
        );
    }, [user?.country, countries]);


    const percent = resetCooldown.active
        ? 100 - Math.round((resetCooldown.remaining / total_cooldown) * 100)
        : 0;



    return (
        <>
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
                    <Text>{user?.email}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <MailOutlined /> Phone #
                        </Space>
                    }
                >
                    {user?.phone || "-"}
                </Descriptions.Item>
                {passwordChange && (
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
                    </Descriptions.Item>)
                }

                <Descriptions.Item
                    label={
                        <Space>
                            <GlobalOutlined /> Country
                        </Space>
                    }
                >
                    <Space wrap>
                        <span>{user?.country}</span>
                        {countryFlag && (
                            <Image src={countryFlag} width={22} preview={false} />
                        )}
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            💰 Wallet Balance

                            <Tooltip title="Click on the icon to add funds to your wallet">
                                <Link href="/wallet">
                                    <InfoCircleOutlined
                                        style={{
                                            color: "rgba(22, 119, 255, 0.65)",
                                            cursor: "pointer"
                                        }}
                                    />
                                </Link>
                            </Tooltip>
                        </Space>
                    }
                >
                    <Text strong style={{ fontSize: 16 }}>
                        {user?.walletBalance.toFixed(2)}€
                    </Text>
                </Descriptions.Item>
            </Descriptions>
        </>
    )
}

export default PersonalInfo