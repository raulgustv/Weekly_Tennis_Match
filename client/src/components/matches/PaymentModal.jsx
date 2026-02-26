import { Modal, Radio, Space, Typography, Card } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const PaymentModal = ({
    open,
    onCancel,
    onConfirm,
    paymentMethods = [],
    price
}) => {

    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (!open) {
            setSelectedPayment(null);
        }
    }, [open]);

    return (
        <Modal
            title="Please select a payment method"
            open={open}
            onOk={() => onConfirm(selectedPayment)}
            onCancel={onCancel}
            okText="Confirm & join"
            cancelText="Cancel"
            okButtonProps={{
                disabled: !selectedPayment
            }}
            destroyOnClose
        >
            <p style={{ marginBottom: 16 }}>
                Price per player <strong>€{price}</strong>
            </p>

            <Radio.Group
                onChange={(e) => setSelectedPayment(e.target.value)}
                value={selectedPayment}
                style={{ width: "100%" }}
            >
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    {paymentMethods.map((pm) => (
                        <Card
                            key={pm.type}
                            hoverable
                            onClick={() => setSelectedPayment(pm.type)}
                            style={{
                                border:
                                    selectedPayment === pm.type
                                        ? "2px solid #1677ff"
                                        : "1px solid #f0f0f0",
                                borderRadius: 8,
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <Radio value={pm.type} style={{ width: "100%" }}>
                                <strong>{pm.type.toUpperCase()}</strong>
                                <br />
                                <Text type="secondary">{pm.value}</Text>
                            </Radio>
                        </Card>
                    ))}
                </Space>
            </Radio.Group>
        </Modal>
    );
};

export default PaymentModal;