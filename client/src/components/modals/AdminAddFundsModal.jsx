import {
    Modal,
    Form,
    InputNumber,
    Radio,
    Divider,
    Button,
    Space,
    Typography,
    Flex,
} from "antd";
import { toast } from "react-toastify";
import { PlusCircleOutlined } from "@ant-design/icons";
import { paymentMethods } from "../utils/paymentMethods";
import { addFundsUserWallet } from "../../actions/wallet";

const quickAmounts = [5, 10, 20, 50];

const AdminAddFundsModal = ({ openModal, setOpenModal, id, name }) => {
    const [form] = Form.useForm();

    const amount = Form.useWatch("amount", form);

    const handleClose = () => {
        form.resetFields();
        setOpenModal(false);
    };

    const handleAddWalletFunds = async ({ amount, method }) => {
        try {
            const res = await addFundsUserWallet(amount, method, id);

            toast.success(
                `Funds added successfully: ${res?.data?.transaction?.amount}€`
            );

            handleClose();
        } catch (error) {
            toast.error("There was an error adding funds");
        }
    };

    return (
        <Modal
            open={openModal}
            onCancel={handleClose}
            footer={null}
            width={440}
            centered
            destroyOnHidden
            title={
                <Space size="middle">
                    <div
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: "#e6f4ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <PlusCircleOutlined
                            style={{
                                color: "#1677ff",
                                fontSize: 20,
                            }}
                        />
                    </div>

                    <div>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Add funds
                        </Typography.Title>

                        <Typography.Text type="secondary">
                            Add funds to <strong>{name}</strong>'s wallet
                        </Typography.Text>
                    </div>
                </Space>
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleAddWalletFunds}
            >
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please enter an amount.",
                        },
                    ]}
                >
                    <InputNumber
                        min={1}
                        precision={2}
                        suffix="€"
                        placeholder="25"
                        size="large"
                        style={{
                            width: 180,
                            maxWidth: "100%",
                        }}
                    />
                </Form.Item>

                <Flex
                    wrap
                    gap={8}
                    style={{
                        marginTop: -10,
                        marginBottom: 24,
                    }}
                >
                    {quickAmounts.map((value) => (
                        <Button
                            key={value}
                            type={amount === value ? "primary" : "default"}
                            onClick={() =>
                                form.setFieldsValue({
                                    amount: value,
                                })
                            }
                        >
                            {value}€
                        </Button>
                    ))}
                </Flex>

                <Form.Item
                    label="Payment method"
                    name="method"
                    rules={[
                        {
                            required: true,
                            message: "Select a payment method.",
                        },
                    ]}
                >
                    <Radio.Group style={{ width: "100%" }}>
                        <Space orientation="vertical">
                            {paymentMethods.map((mtd) => (
                                <Radio
                                    key={mtd.value}
                                    value={mtd.value}
                                >
                                    <strong>{mtd.label}</strong>
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                </Form.Item>

                <Divider />

                <Flex justify="space-between">
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusCircleOutlined />}
                    >
                        Add funds
                    </Button>
                </Flex>
            </Form>
        </Modal>
    );
};

export default AdminAddFundsModal;