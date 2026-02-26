import { Modal, Radio, Space } from "antd"
import { useEffect, useState } from "react"


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
            setSelectedPayment(null)
        }
    }, [open])

    return (
        <>
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
                    Price per player <strong>€{price}</strong>
                </p>

                <Radio.Group
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    value={selectedPayment}
                    style={{width: "100%"}}
                >
                    <Space orientation="vertical" style={{width: "100%"}}>
                        {paymentMethods.map((pm) => (
                            <Radio key={pm.type} value={pm.type}>
                                <strong>{pm.type.toUpperCase()}</strong>
                                <br />
                                <small>{pm.value}</small>
                            </Radio>
                        ))}
                    </Space>
                </Radio.Group>
            </Modal>
        </>
    )
}

export default PaymentModal