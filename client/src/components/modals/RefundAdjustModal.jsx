import { Form, Input, Modal, Select, Typography } from "antd";
import LoadingSpinner from "../utils/LoadingSpinner";
import { adminRefundAdjust } from "../../actions/wallet";
import {toast} from 'react-toastify'

const RefundAdjustModal = ({ user, open, setOpen }) => {

    const [form] = Form.useForm();
    const { Text } = Typography;



    const onFinish = async(values) => {
        try {

            const payload = {
                userId: user._id,
                amount: values.amount, 
                type: values.type,
                note: values.note
            } 

            const res = await adminRefundAdjust(payload)

            toast.success(res.message)

 

            form.resetFields();
            setOpen(false);
        } catch ({response}) {
            console.log(response)
            toast.error(response?.data?.message || 'Error processing adjustment/refund')
        }

    };

    if (!user) return <LoadingSpinner />;

    return (
        <Modal
            open={open}
            onCancel={() => {
                form.resetFields();
                setOpen(false);
            }}
            onOk={() => form.submit()}
            okText="Confirm"
            cancelText="Cancel"
            title={`Refund / Adjustment — ${user?.name} ${user?.lastname}`}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                {/* TYPE */}
                <Form.Item
                    name="type"
                    label="Transaction type"
                >
                    <Select
                        placeholder="Select type"
                        options={[
                            { value: "refund", label: "Refund (+)" },
                            { value: "adjustment", label: "Adjustment (-)" },
                        ]}
                    />
                </Form.Item>

                {/* AMOUNT */}
                <Form.Item
                    name="amount"
                    label="Amount (€)"
                >
                    <Input
                        type="number"
                        min={-500}
                        max={500}
                        placeholder="e.g. 5.5 or -3.2"
                    />
                </Form.Item>

                {/* NOTE */}
                <Form.Item
                    name="note"
                    label={
                        <>
                            Additional note <Text type="secondary">(optional)</Text>
                        </>
                    }
                >
                    <Input.TextArea
                        rows={4}
                        showCount
                        maxLength={300}
                        placeholder="Reason for this action..."
                    />
                </Form.Item>

                {/* INFO */}
                <Text type="secondary">
                    Refund → positive amount <br />
                    Adjustment → negative amount
                </Text>
            </Form>
        </Modal>
    );
};

export default RefundAdjustModal;