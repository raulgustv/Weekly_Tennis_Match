import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Typography, Space, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import { useAuth } from "../../context";
import { confirmAccountDelete } from "../../actions/auth";

const { Title, Paragraph } = Typography;

const ConfirmAccountDeletion = () => {
    const { token } = useParams();


    console.log(token)

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);

            const res = await confirmAccountDelete(token);

            toast.success(res?.message || "Your account has been deleted");
            setDone(true);

            await logout();

            setTimeout(() => navigate("/auth"), 2500);
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "This confirmation link is invalid or has expired"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
            <Card style={{ maxWidth: 480, width: "100%" }}>
                <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                    <Space align="start">
                        <ExclamationCircleOutlined style={{ color: "#cf1322", fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>
                            Confirm account deletion
                        </Title>
                    </Space>

                    {done ? (
                        <Alert
                            type="success"
                            showIcon
                            title="Account deleted"
                            description="Your account and personal data have been permanently removed. Redirecting you now..."
                        />
                    ) : (
                        <>
                            <Alert
                                type="error"
                                showIcon
                                title="This is your last chance to cancel"
                                description={`This will permanently delete the account for ${user?.email || "your account"}. This cannot be undone.`}
                            />

                            <Paragraph type="secondary">
                                Clicking the button below immediately and permanently erases your
                                personal data. This link is single-use and expires shortly.
                            </Paragraph>

                            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                                <Button onClick={() => navigate("/games")}>Cancel</Button>
                                <Button danger type="primary" loading={loading} onClick={handleConfirm}>
                                    Permanently delete my account
                                </Button>
                            </Space>
                        </>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default ConfirmAccountDeletion;