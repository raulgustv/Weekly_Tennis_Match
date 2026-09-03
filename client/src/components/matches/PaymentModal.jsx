import { Modal, Radio, Space, Typography, Card, Alert } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const PaymentModal = ({
    open,
    onCancel,
    onConfirm,
    paymentMethods = [],
    price,
    balance,
    walletPaymentAllowed,
    isBackup = false // 🔵 CAMBIO: prop nueva. La pasa JoinMatch.jsx cuando se abre el modal desde "Join as backup".
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
            // 🔵 CAMBIO: texto del botón distinto cuando es backup
            okText={isBackup ? "Confirm & join as backup" : "Confirm & join"}
            cancelText="Cancel"
            okButtonProps={{
                disabled: !selectedPayment
            }}
            destroyOnHidden
        >
            {/* 🔵 CAMBIO: bloque nuevo — aviso que pidió el cliente: no hay
                que pagar todavía, y si es wallet se retiene y se devuelve
                si el partido no llega a jugarse. */}
            {isBackup && (
                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                    title="You're joining as a backup"
                    description="You don't need to transfer any money or worry about paying right now. If you select wallet, the amount will be held from your balance, but it will be fully refunded if the match doesn't end up being played. If a spot opens up, you'll be automatically promoted to player."
                />
            )}

            <p style={{ marginBottom: 16 }}>
                Price per player <strong>{formatEUR(numericPrice)}</strong>
            </p>

            <Radio.Group
                onChange={(e) => setSelectedPayment(e.target.value)}
                value={selectedPayment}
                style={{ width: "100%" }}
            >
                <Space
                    orientation="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                >
                    {paymentMethods
                        .filter((pm) => pm.type !== 'wallet' || walletPaymentAllowed) 
                        .map((pm) => {

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