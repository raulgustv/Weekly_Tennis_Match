import { Form, Input, InputNumber, Modal, Select, Typography, Space, Tooltip } from "antd";
//import LoadingSpinner from "../utils/LoadingSpinner";
import { adminRefundAdjust } from "../../actions/wallet";
import { toast } from 'react-toastify'
import { QuestionCircleOutlined } from "@ant-design/icons";

const RefundAdjustModal = ({ user, open, setOpen, refresh }) => {

    const [form] = Form.useForm();
    const { Text } = Typography;


    const onFinish = async (values) => {
        try {

            const payload = {
                userId: user._id,
                amount: values.amount,
                type: values.type,
                note: values.note
            }

            const res = await adminRefundAdjust(payload)
            refresh()

            toast.success(res.message)

            form.resetFields();
            setOpen(false);
        } catch ({ response }) {
            console.log(response)
            toast.error(response?.data?.message || 'Error processing adjustment/refund')
        }

    };

    //if (!user) return <LoadingSpinner />;

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
                    rules={[
                        { required: true, message: 'Please select a transaction type' }
                    ]}
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
                    label={
                        <Space size={4}>
                            <Text>Amount</Text>

                            <Tooltip
                                title={
                                    <>
                                        • Enter only positive amounts.<br />
                                        • Refunds will credit the user's wallet.<br />
                                        • Adjustments will deduct the entered amount automatically.
                                    </>
                                }
                            >
                                <QuestionCircleOutlined
                                    style={{ color: "#1677ff", cursor: "pointer" }}
                                />
                            </Tooltip>

                            <Text type="secondary">(max amount €500)</Text>
                        </Space>
                    }
                    rules={[
                        { required: true, message: 'Please add an amount' }
                    ]}
                >
                    <InputNumber
                        type="number"
                        min={0}
                        max={500}
                        placeholder="e.g. 5.50"
                        suffix='€'
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
                        placeholder="Reason for adjustment/refund"
                    />
                </Form.Item>

                {/* INFO */}
                <Text type="secondary">
                    Refund → adds the entered amount to the wallet.<br />
                    Adjustment → deducts the entered amount from the wallet.
                </Text>
            </Form>
        </Modal>
    );
};

export default RefundAdjustModal;