import { Modal, Form, Input, Rate, Select } from 'antd'
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify'
import { category_options } from '../utils/categoryOptions';
import { submitFeedbackResponse } from '../../actions/feedback';

const FeedbackModal = ({ open, feedbackRequestId, onClose }) => {

    const { TextArea } = Input;

    const [form] = useForm();


    const handleSubmit = async ({rating, category, comment}) => {
        try {

            const res = await submitFeedbackResponse(rating, category, comment, feedbackRequestId)

            if(res?.responded) toast.success('Your feedback has been submitted. Thank you')
            
            form.resetFields();
            onClose();
            
        } catch (error) {
            console.log(error)
        }
        
    }

    const handleCancel = async () => {
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
                        rules={[{ required: true, message: 'Please select a star rating' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label='Tell us about your feedback'
                        rules={[
                            { required: true, message: 'Please select a category' }
                        ]}
                    >
                        <Select
                            placeholder="Please select a category"
                            options={category_options}
                        />
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