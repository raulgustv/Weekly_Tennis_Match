import { Modal, Form, Input, Rate, Select } from 'antd'
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify'
import { app_category_options, match_category_options } from '../utils/categoryOptions';
import { dismissFeedbackResponse, submitFeedbackResponse } from '../../actions/feedback';

const FeedbackModal = ({ open, feedbackRequestId, onClose, modalTitle, modalType }) => {

    const { TextArea } = Input;

    const [form] = useForm();

    const category_select = {
        app: app_category_options,
        match: match_category_options
    }

    const categoryOptions = category_select[modalType] || null;


    const handleSubmit = async ({rating, category, comment}) => {
        try {

            const res = await submitFeedbackResponse(rating, category, comment, feedbackRequestId)

            if(res?.responded) toast.success('Your feedback has been submitted. Thank you')
            
            form.resetFields();
            onClose();
            
        } catch (error) {
            console.log(error)
            toast.error('There was an issue submitting your feedback')
            onClose()
        }
        
    }

    const handleCancel = async () => {
        try {
            await dismissFeedbackResponse(feedbackRequestId);

            onClose()
            
        } catch (error) {
            console.log(error)
            toast.error('There was an issue with your feedback')
            onClose()
        }
    }

    return (
        <>
            <Modal
                title={modalTitle}
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
                            options={categoryOptions}
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