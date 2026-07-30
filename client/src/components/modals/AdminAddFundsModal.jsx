import {
    Modal,
    Form,
    InputNumber,
    Radio,
    Alert,
    Divider,
    Button,
    Space,
    Typography,
    Flex,
} from "antd";

import {
    PlusCircleOutlined,
} from "@ant-design/icons";
import { paymentMethods } from "../utils/paymentMethods";


const AdminAddFundsModal = ({ openModal, setOpenModal, id }) => {

    const [form] = Form.useForm();

    const handleClose = () =>{
        form.resetFields();
        setOpenModal(false)
    }

    const addWalletFunds = () =>{
        try {
            
        } catch (error) {
            
        }
    }


    return (
        <Modal
            open={openModal}
            onCancel={handleClose}
            footer={null}
            width={500}
            centered
            destroyOnClose
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
                            justifyContent: "center"
                        }}
                    >
                        <PlusCircleOutlined
                            style={{
                                color: "#1677ff",
                                fontSize: 20
                            }}
                        />
                    </div>

                    <div>
                        <Typography.Title
                            level={4}
                            style={{ margin: 0 }}
                        >
                            Add funds
                        </Typography.Title>

                        <Typography.Text type="secondary">
                            Submit a wallet deposit request
                        </Typography.Text>
                    </div>
                </Space>
            }
        >
            <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
            >

                <Alert
                    showIcon
                    type="info"
                    message="How it works"
                    description="After completing the payment, your request will be reviewed by an administrator. Once approved, the amount will be credited to your wallet."
                />

                <Form
                    layout="vertical"
                    form={form}
                >

                    <Form.Item
                        label="Amount (€)"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Please enter an amount."
                            }
                        ]}
                    >
                        <InputNumber
                            min={1}
                            precision={2}
                            addonAfter="€"
                            placeholder="25"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Payment method"
                        name="method"
                        rules={[
                            {
                                required: true,
                                message: "Select a payment method."
                            }
                        ]}
                    >
                        <Radio.Group
                            style={{ width: "100%" }}
                        >
                            <Space orientation="vertical">

                              {paymentMethods.map((mtd) =>(
                                <Radio key={mtd?.value} value={mtd?.value}>
                                    <strong>{mtd?.label}</strong>
                                </Radio>
                              ))}

                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Divider />

                    <Flex justify="end" gap={10}>

                        <Button
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusCircleOutlined />}
                        >
                            Submit request
                        </Button>

                    </Flex>

                </Form>

            </Space>
        </Modal>
    )
}

export default AdminAddFundsModal



