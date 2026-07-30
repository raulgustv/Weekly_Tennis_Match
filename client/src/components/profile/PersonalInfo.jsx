import useCountdown from "../../hooks/useCountdown";
import { Descriptions, Image, Space, Typography, Button, Progress, Tooltip } from "antd";
import {
    GlobalOutlined,
    InfoCircleOutlined,
    LockOutlined,
    MailOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import { formatTimeMs } from "../../helpers/time";
import { useCountries } from "../../hooks/useCountries";
import { useMemo, useState } from "react";
import AdminAddFundsModal from "../modals/AdminAddFundsModal";


const PersonalInfo = ({ user, handleSendReset = null, passwordChange, addFundsButton }) => {


    const { Text, Link } = Typography;

    const { countries } = useCountries()

    const total_cooldown = 120000

    const resetCooldown = useCountdown({
        duration: total_cooldown
    })

    //console.log(user)

    const [openFundModal, setOpenFundModal] = useState(false)

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


    const addFunds = () => {
        setOpenFundModal(true)
    }



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

                {addFundsButton && (
                    <Descriptions.Item
                        label={
                            <Space>
                                💰 Wallet Balance

                                <Tooltip title="Wallet information">
                                    <Link href="/wallet">
                                        <InfoCircleOutlined />
                                    </Link>
                                </Tooltip>
                            </Space>
                        }
                    >
                        <Space align="center">
                            <Text strong style={{ fontSize: 16 }}>
                                {user?.walletBalance.toFixed(2)}€
                            </Text>

                            <Tooltip title="Add funds">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="small"
                                    icon={<PlusCircleOutlined />}
                                    onClick={addFunds}
                                />
                            </Tooltip>
                        </Space>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <AdminAddFundsModal openModal={openFundModal} setOpenModal={setOpenFundModal} id={user?._id} name={user?.name} />
        </>
    )
}

export default PersonalInfo