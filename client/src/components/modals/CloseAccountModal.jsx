import { useState } from "react";
import { Button, Modal, Typography, Space, Alert, Progress } from "antd";
import {
    ExclamationCircleOutlined,
    PauseCircleOutlined,
    DeleteOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../context";
import { useNavigate } from "react-router-dom";
import useCountdown from "../../hooks/useCountdown";
import { formatTimeMs } from "../../helpers/time";
import { closeAccount, requestAccountDelete } from "../../actions/auth";

const { Title, Text, Paragraph } = Typography;

const CloseAccountModal = ({ user }) => {
    const [openModal, setOpenModal] = useState(false);
    const [closing, setClosing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();


    // matches the 60s cooldown enforced by the backend
    const total_cooldown = 60000;
    const cooldown = useCountdown({ duration: total_cooldown });

    const percent = cooldown.active
        ? 100 - Math.round((cooldown.remaining / total_cooldown) * 100)
        : 0;

    const hasWalletBalance = (user?.walletBalance || 0) > 0;

    const handleClose = () => {
        setOpenModal(false);
        setEmailSent(false);
    };

    // OPTION 1 — reversible: just deactivates the account
    const handleCloseAccount = async () => {
        try {
            setClosing(true);

            const res = await closeAccount();

            toast.success(res?.message || "Your account has been closed");

            await logout();
            navigate("/auth");
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong closing your account"
            );
        } finally {
            setClosing(false);
        }
    };

    // OPTION 2 — GDPR erasure: sends a confirmation link, nothing is deleted until it's opened
    const handleRequestDeletion = async () => {
        try {
            setDeleting(true);

            const res = await requestAccountDelete();

            setEmailSent(true);
            cooldown.start();

            toast.success(res?.message || "Confirmation email sent");
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong requesting account deletion"
            );
        } finally {
            setDeleting(false);
        }
    };

    if(user.role === 'admin') return (
        <Alert 
            title='Admins cannot close/delete accounts'
            description='Please note that as an admin you cannot close or delete your account, to complete this action please
            transfer your admin role to a different user and change your role to user
            '
        />
    )

    return (
        <div
            style={{
                border: "1px solid #ffccc7",
                background: "#fff2f0",
                borderRadius: 12,
                padding: 20,
                marginTop: 24,
            }}
        >
            <Space align="start" size={12}>
                <ExclamationCircleOutlined style={{ color: "#cf1322", fontSize: 20, marginTop: 3 }} />

                <div>
                    <Title level={5} style={{ margin: 0, color: "#cf1322" }}>
                        Close account
                    </Title>

                    <Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 12, maxWidth: 480 }}>
                        Leaving Weekly Tennis? You can close your account temporarily or
                        permanently delete all your data.
                    </Paragraph>

                    <Button danger onClick={() => setOpenModal(true)}>
                        Close account
                    </Button>
                </div>
            </Space>

            <Modal
                open={openModal}
                onCancel={handleClose}
                title="Close your account"
                destroyOnHidden
                footer={null}
                width={560}
            >
                {!emailSent ? (
                    <>
                        {hasWalletBalance && (
                            <Alert
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                                title="You still have funds in your wallet"
                                description="Contact an administrator to get your balance returned before continuing — this cannot be recovered afterwards."
                            />
                        )}

                        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                            Choose what you'd like to do:
                        </Paragraph>

                        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                            {/* OPTION 1 — reversible */}
                            <div style={{ border: "1px solid #f0f0f0", borderRadius: 12, padding: 16 }}>
                                <Space align="start">
                                    <PauseCircleOutlined style={{ fontSize: 20, color: "#8c8c8c", marginTop: 3 }} />

                                    <div style={{ flex: 1 }}>
                                        <Text strong>Just close my account</Text>

                                        <Paragraph type="secondary" style={{ margin: "4px 0 12px" }}>
                                            Your account is deactivated and you're logged out. Your data
                                            is kept, and it can be reopened later if needed. You may have to contact 
                                            your administrator to obtain access again
                                        </Paragraph>

                                        <Button loading={closing} onClick={handleCloseAccount}>
                                            Close account
                                        </Button>
                                    </div>
                                </Space>
                            </div>

                            {/* OPTION 2 — GDPR erasure */}
                            <div style={{ border: "1px solid #ffccc7", borderRadius: 12, padding: 16 }}>
                                <Space align="start">
                                    <DeleteOutlined style={{ fontSize: 20, color: "#cf1322", marginTop: 3 }} />

                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ color: "#cf1322" }}>
                                            Close & delete all my data
                                        </Text>

                                        <Paragraph type="secondary" style={{ margin: "4px 0 12px" }}>
                                            Permanently erases your name, email, phone number and
                                            password. <b>This cannot be undone.</b> We'll email you a
                                            confirmation link — nothing is deleted until you open it.
                                        </Paragraph>

                                        <Button danger loading={deleting} onClick={handleRequestDeletion}>
                                            Delete everything
                                        </Button>
                                    </div>
                                </Space>
                            </div>
                        </Space>
                    </>
                ) : (
                    <>
                        <Space direction="vertical" align="center" style={{ width: "100%", padding: "12px 0" }}>
                            <MailOutlined style={{ fontSize: 32, color: "#cf1322" }} />

                            <Title level={5} style={{ margin: 0, textAlign: "center" }}>
                                Check your email
                            </Title>

                            <Paragraph type="secondary" style={{ textAlign: "center", maxWidth: 340 }}>
                                We've sent a confirmation link to your email address. Open it from
                                this same device (you'll need to be logged in) to permanently delete
                                your account. The link expires in 15 minutes.
                            </Paragraph>

                            {cooldown.active && (
                                <div style={{ width: "100%" }}>
                                    <Progress percent={percent} status="active" showInfo={false} />
                                    <Text
                                        type="secondary"
                                        style={{ display: "block", textAlign: "center", fontSize: 12, marginTop: 4 }}
                                    >
                                        You can request a new link in {formatTimeMs(cooldown.remaining)}
                                    </Text>
                                </div>
                            )}
                        </Space>

                        <Space style={{ marginTop: 12, width: "100%", justifyContent: "flex-end" }}>
                            <Button onClick={handleClose}>Close</Button>
                        </Space>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CloseAccountModal;