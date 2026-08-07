import { Modal, Radio, Space, Typography, Card } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const PaymentModal = ({
    open,
    onCancel,
    onConfirm,
    paymentMethods = [],
    price,
    balance
}) => {

    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (!open) {
            setSelectedPayment(null);
        }
    }, [open]);

    // 👉 formatter euros
    const formatEUR = (value) =>
        new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(Number(value) || 0);

    const numericPrice = Number(price);
    const numericBalance = Number(balance) || 0;

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
            destroyOnHidden
        >
            <p style={{ marginBottom: 16 }}>
                Price per player <strong>{formatEUR(numericPrice)}</strong>
            </p>

            <Radio.Group
                onChange={(e) => setSelectedPayment(e.target.value)}
                value={selectedPayment}
                style={{ width: "100%" }}
            >
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                >
                    {paymentMethods.map((pm) => {

                        const isWallet = pm.type === "wallet";
                        const isDisabled =
                            isWallet && numericBalance < numericPrice;

                        return (
                            <Card
                                key={pm.type}
                                hoverable={!isDisabled}
                                onClick={() =>
                                    !isDisabled && setSelectedPayment(pm.type)
                                }
                                style={{
                                    border:
                                        selectedPayment === pm.type
                                            ? "2px solid #1677ff"
                                            : "1px solid #f0f0f0",
                                    borderRadius: 8,
                                    cursor: isDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity: isDisabled ? 0.5 : 1,
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <Radio
                                    value={pm.type}
                                    disabled={isDisabled}
                                    style={{ width: "100%" }}
                                >
                                    <strong>{pm.type.toUpperCase()}</strong>
                                    <br />

                                    <Text type="secondary">
                                        {isWallet
                                            ? `${formatEUR(numericBalance)} available`
                                            : pm.value}
                                    </Text>

                                    {isWallet && isDisabled && (
                                        <>
                                            <br />
                                            <Text type="danger">
                                                Insufficient balance (requires{" "}
                                                {formatEUR(numericPrice)})
                                            </Text>
                                        </>
                                    )}
                                </Radio>
                            </Card>
                        );
                    })}
                </Space>
            </Radio.Group>
        </Modal>
    );
};

export default PaymentModal;