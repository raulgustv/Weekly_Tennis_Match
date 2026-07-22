import {Modal, Form, Input, Rate} from 'antd'
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify'

const FeedbackModal = ({open, feedbackRequestId, onClose}) => {

    const {TextArea}  = Input;

    const [form] = useForm();

    const handleSubmit = () =>{
        console.log('Thanks feedback')
    }

    const handleCancel = async() => {
        console.log('No feedback :(')
    }

    return (
        <>
            <Modal
                title="How is the experience so far?"
                open={open}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Send"
                cancelText="Maybe later"
                destroyOnHidden
                mask={false}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="rating"
                        label="Leave us a review using the MTC App"
                        rules={[{ required: true, message: 'Please select a star rating'}]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Let us know about your experience so far (optional)"
                    >
                        <TextArea 
                            rows={3}
                            maxLength={1000}
                            showCount
                        />
                    </Form.Item>
                </Form>                
            </Modal>
        </>
  )
}

export default FeedbackModal