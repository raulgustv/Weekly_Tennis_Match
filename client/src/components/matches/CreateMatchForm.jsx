import { Form, Card, Button, Radio, Flex, Checkbox, DatePicker, Row, Col, TimePicker, Space, Select, Input } from 'antd'
import { useCourts } from '../../hooks/useCourts';
import { MinusCircleOutlined, PlusOutlined, TrophyFilled } from "@ant-design/icons";
import dayjs from 'dayjs';
import { useState } from 'react';
import { createNewMatch } from '../../actions/matches';
import { toast } from 'react-toastify'
import LoadingSpinner from '../utils/LoadingSpinner';

const CreateMatchForm = ({refreshMatches}) => {

    const { Meta } = Card;
    const [form] = Form.useForm();
    const { courts } = useCourts();
    const [loading, setLoading] = useState(false)

    const availableCourts = courts.filter(c => c.active);

    const selectedLocation = Form.useWatch("location", form);

    const selectedCourts = availableCourts.find(c => c?.slug === selectedLocation);

    const paymentMethodOptions = [
        { value: 'bizum', label: 'Bizum' },
        { value: 'revolut', label: 'Revolut' },
        { value: 'cash', label: 'Cash' },
        { value: 'paypal', label: 'Paypal' },
    ]

    const handleNewMatch = async (values) => {
        const payload = {
            locationSlug: values.location,
            date: values.date.format("YYYY-MM-DD"),
            startTime: values.startTime.format("HH:mm"),
            endTime: values.endTime.format("HH:mm"),
            courtNumbers: values.courtNumbers.map(Number),
            paymentMethods: values.paymentMethods.map(pm => ({
                type: pm.type,
                value: pm.value
            }))
        }

        try {

            setLoading(true);
            const res = await createNewMatch(payload);

            toast.success(
                <div>
                    <strong>Match has been created</strong>
                    <br />
                    Date: {dayjs(res?.date).format("dddd, MMM Do")}
                    <br />
                    Time: {res?.startTime}
                </div>
            )

            form.resetFields()

            refreshMatches()
            

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Card title="New match" style={{ width: "100%" }}>
                <Meta
                    title="Register new match"
                    description="Enter match details"
                />

                <Form
                    layout='vertical'
                    onFinish={handleNewMatch}
                    style={{ marginTop: 24 }}
                    form={form}
                >
                    <Form.Item name="location" label={<span>Match location <small>(select only one)</small></span>}
                        rules={[
                            { required: true, message: "Please select a location" }
                        ]}
                    >
                        <Flex gap="middle">
                            <Radio.Group size='large' onChange={(e) => e.target.value}>
                                {availableCourts.map((c) => (
                                    <Radio.Button value={c?.slug} key={c?._id}>
                                        {c?.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Flex>
                    </Form.Item>

                    {selectedCourts && (
                        <Form.Item name="courtNumbers" label={<span>"Select courts for match"<small>(You can select multiple courts)</small></span>}
                            rules={[
                                { required: true, message: "At least one court must be selected" }
                            ]}
                        >
                            <Checkbox.Group options={selectedCourts?.courts.map((cn => ({
                                value: cn.number.toString(),
                                label: cn.number.toString()
                            })))}>

                            </Checkbox.Group>
                        </Form.Item>)}

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date"
                                label="Select a date for the match"
                                rules={[
                                    { required: true, message: 'Please select a valid date' }
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD"
                                    minDate={dayjs().add(1, "day")}
                                    maxDate={dayjs().add(30, "day")}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="startTime"
                                label="Select a start time"
                                rules={[
                                    { required: true, message: 'Please select a valid start time' }
                                ]}
                            >
                                <TimePicker
                                    style={{ width: "100%" }}
                                    minuteStep={30}
                                    format="HH:mm"
                                    hideDisabledOptions
                                    onChange={(value) => {
                                        if (!value) return;

                                        const endTime = value.add(2, "hour");

                                        form.setFields([
                                            { name: "endTime", value: endTime }
                                        ])
                                    }}
                                    disabledTime={() => ({
                                        disabledHours: () => {
                                            const hours = [];
                                            for (let i = 0; i < 9; i++) hours.push(i);
                                            for (let i = 22; i < 24; i++) hours.push(i);

                                            return hours;
                                        },
                                    })}



                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="endTime"
                                label="Select an end time"
                                dependencies={["startTime"]}
                                rules={[
                                    { required: true, message: 'Please select a valid end time' }
                                ]}
                            >
                                <TimePicker
                                    style={{ width: "100%" }}
                                    format="HH:mm"
                                    minuteStep={30}
                                    use12Hours={true}
                                    disabledTime={() => {
                                        const startTime = form.getFieldValue("startTime");
                                        if (!startTime) return {}

                                        const disabledHours = [];

                                        for (let i = 0; i <= startTime.hour(); i++) {
                                            disabledHours.push(i)
                                        }

                                        return {
                                            disabledHours: () => disabledHours
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


                    {/* PAYMENT SECTION */}
                    <Form.List name="paymentMethods"
                        rules={[
                            {
                                validator: async (_, paymentMethods) => {
                                    if (!paymentMethods || paymentMethods.length === 0) {
                                        return Promise.reject(
                                            new Error("At least one payment method is required")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                <Form.Item label="Payment methods" validateStatus={errors.length ? "error" : ""} help={errors}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                        block
                                    >
                                        Add payment method
                                    </Button>
                                </Form.Item>

                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{ display: "flex", marginBottom: 8 }}
                                        align="baseline"
                                    >
                                        {/* TYPE */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, "type"]}
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                placeholder="Type"
                                                style={{ width: 150 }}
                                                options={paymentMethodOptions}
                                                onChange={(value) => {
                                                    if (value === "cash") {
                                                        form.setFieldsValue({
                                                            paymentMethods: {
                                                                [name]: { value: "N/A" },
                                                            },
                                                        });
                                                    } else {
                                                        form.setFieldsValue({
                                                            paymentMethods: {
                                                                [name]: { value: undefined },
                                                            },
                                                        });
                                                    }
                                                }}
                                            />
                                        </Form.Item>

                                        {/* VALUE */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, "value"]}
                                            rules={[
                                                {
                                                    required: form.getFieldValue([
                                                        "paymentMethods",
                                                        name,
                                                        "type",
                                                    ]) !== "cash",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Phone / user / info"
                                                disabled={
                                                    form.getFieldValue([
                                                        "paymentMethods",
                                                        name,
                                                        "type",
                                                    ]) === "cash"
                                                }
                                            />
                                        </Form.Item>

                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: "red" }}
                                        />
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>





                    <Form.Item style={{ marginTop: 32 }}>
                        <Button style={{
                            background: "#46AF50",
                            borderColor: "#46AF50",
                            color: "white"
                        }} type='primary' htmlType='submit' size='large' disabled={loading} icon={<TrophyFilled />}>
                            {loading ? <LoadingSpinner /> : "Add court"}
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </>
    )
}

export default CreateMatchForm
