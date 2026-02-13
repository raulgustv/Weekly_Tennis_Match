import { Button, Select, Form, InputNumber, Input, Modal } from "antd";
import { completeGoogleProfile } from "../../actions/auth";

const CompleteProfile = ({ open, user, onComplete }) => {
    const handleSubmit = async (values) => {
        try {
            const { data } = await completeGoogleProfile(values)
            const updatedUser = {
                ...user,
                ...values,
                profileComplete: true,
            };

            onComplete(updatedUser);
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Modal
            open={open}
            closable={false}
            maskClosable={false}
            footer={null}
            title="Before continuing please complet your profile"
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="phone"
                    rules={[{ required: true, message: "Phone required" }]}
                    label="Phone number"
                >
                    <Input />
                </Form.Item>

                <Form.Item name="gender" rules={[{ required: true }]} label="Gender">
                    <Select>
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ntrplvl"
                    rules={[{ required: true }]}
                    label="NTRP level"
                >
                    <InputNumber min={1} max={7} />
                </Form.Item>

                <Form.Item
                    name="country"
                    rules={[{ required: true, message: "Phone required" }]}
                    label="Country"
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" block >
                    Save
                </Button>
            </Form>
        </Modal>
    );
};

export default CompleteProfile;
