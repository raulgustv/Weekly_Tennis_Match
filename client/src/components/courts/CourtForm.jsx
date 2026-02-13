import { Card, Form, Input, InputNumber, Button } from 'antd'
import { PushpinOutlined } from "@ant-design/icons";
import LoadingSpinner from '../utils/LoadingSpinner';

const CourtForm = ({ onCreate, loading }) => {

    const [form] = Form.useForm();

    const handleFinished = async (values) => {
        await onCreate(values);
        form.resetFields();
    }

    return (
        <>
            <Card title="Add new court location">
                <Form layout='vertical' form={form} onFinish={handleFinished}>
                    <Form.Item label="Location" name="name" rules={[
                        { required: true, message: "Court name is required" },
                        { min: 5, max: 500, message: "Court address must be between 3 and 500 characters long" }
                    ]}>
                        <Input placeholder='Casa de campo' />
                    </Form.Item>

                    <Form.Item label="Google maps link" name="address" rules={[
                        { required: true, message: "Google maps link is required" },
                        { min: 5, max: 500, message: "Court address must be between 3 and 500 characters long" }
                    ]}>
                        <Input placeholder='https://maps.google.com' />
                    </Form.Item>

                    <Form.Item label="Total courts" name="courts" rules={[
                        { required: true, message: "Please add total # of courts" },
                        { type: "number", min: 1, message: "There must be at least one court" },
                        { type: "number", max: 50, message: "There  cannot be more than 50 courts" }
                    ]}>
                        <InputNumber placeholder='5' />
                    </Form.Item>

                    <div style={{marginTop: "auto"}}>
                        <Button type='primary' htmlType='submit' icon={<PushpinOutlined />} style={{
                            background: "#46AF50",
                            borderColor: "#46AF50",
                            color: "white"
                        }} disabled={loading}>
                            {loading ? <LoadingSpinner color='#3C638E' /> : "Add court"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </>
    )
}

export default CourtForm
