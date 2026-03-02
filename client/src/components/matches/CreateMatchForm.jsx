import {
  Form,
  Card,
  Button,
  Radio,
  Flex,
  Checkbox,
  DatePicker,
  Row,
  Col,
  TimePicker,
  Space,
  Select,
  Input,
  InputNumber,
  Tooltip,
} from "antd";
import { useCourts } from "../../hooks/useCourts";
import {
  MinusCircleOutlined,
  PlusOutlined,
  StarFilled,
  TrophyFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import { createNewMatch } from "../../actions/matches";
import { toast } from "react-toastify";
import LoadingSpinner from "../utils/LoadingSpinner";
import colors from "../../themes/colors";

const CreateMatchForm = ({ refreshMatches }) => {
  const { Meta } = Card;
  const [form] = Form.useForm();
  const { courts } = useCourts();
  const [loading, setLoading] = useState(false);

  const availableCourts = courts
                          .filter((c) => c.active)
                          .sort((a,b) => Number(b.favorite) - (Number(a.favorite)))
  const selectedLocation = Form.useWatch("location", form);
  const selectedCourts = availableCourts.find(
    (c) => c?.slug === selectedLocation
  );

  const paymentMethodOptions = [
    { value: "bizum", label: "Bizum" },
    { value: "revolut", label: "Revolut" },
    { value: "cash", label: "Cash" },
    { value: "paypal", label: "Paypal" },
  ];

  const selectedCourtNumbers = Form.useWatch("courtNumbers", form);
  const priceValue = Form.useWatch("price", form)

  const totalPlayers = selectedCourtNumbers ? selectedCourtNumbers.length * 4 : 0;
  const pricePlayer = totalPlayers && priceValue ? Number(priceValue / totalPlayers).toFixed(2) : null

  const handleNewMatch = async (values) => {
    const payload = {
      locationSlug: values.location,
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      courtNumbers: values.courtNumbers.map(Number),
      price: values.price,
      paymentMethods: values.paymentMethods.map((pm) => ({
        type: pm.type,
        value: pm.value,
      })),
    };

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
      );

      form.resetFields();
      refreshMatches();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="New match" style={{ width: "100%" }}>
      <Meta
        title="Register new match"
        description="Enter match details"
      />

      <Form
        layout="vertical"
        onFinish={handleNewMatch}
        style={{ marginTop: 24 }}
        form={form}
      >
        {/* LOCATION */}
        <Form.Item
          name="location"
          label="Match location"
          rules={[{ required: true }]}
        >
          <Radio.Group size="large" style={{ width: "100%" }}>
            <Flex wrap gap="small">
              {availableCourts.map((c) => (
                <Radio.Button
                  key={c._id}
                  value={c.slug}
                  style={{ flex: "1 1 auto", textAlign: "center" }}
                >
                  {c.name} {c.favorite && (<StarFilled style={{color: colors.yellow}} />)}
                </Radio.Button>
              ))}
            </Flex>
          </Radio.Group>
        </Form.Item>

        {/* COURTS */}
        {selectedCourts && (
          <Form.Item
            name="courtNumbers"
            label="Select courts"
            rules={[{ required: true }]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <Flex wrap gap="small">
                {selectedCourts.courts.map((cn) => (
                  <Checkbox
                    key={cn.number}
                    value={cn.number.toString()}
                  >
                    {cn.number}
                  </Checkbox>
                ))}
              </Flex>
            </Checkbox.Group>
          </Form.Item>
        )}

        {/* DATE & TIME */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker
                style={{ width: "100%" }}
                minDate={dayjs().add(1, "day")}
                maxDate={dayjs().add(30, "day")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="startTime" label="Start time" rules={[{ required: true }]}>
              <TimePicker
                style={{ width: "100%" }}
                minuteStep={30}
                format="HH:mm"
                onChange={(value) => {
                  if (!value) return;
                  form.setFieldsValue({
                    endTime: value.add(2, "hour"),
                  });
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item name="endTime" label="End time" rules={[{ required: true }]}>
              <TimePicker style={{ width: "100%" }} minuteStep={30} />
            </Form.Item>
          </Col>
        </Row>


        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="price"
              label={
                <Tooltip title="Total price of all selected courts">
                  Total price (€)
                </Tooltip>
              }
              rules={[{ required: true }]}
            >
              <InputNumber
                title="Enter courts total price"
                prefix="€"
                min={0}
                style={{ width: "100%" }}
                suffix={
                  pricePlayer && (
                    <span style={{ fontSize: 12 }}>
                      {pricePlayer}€ / player
                    </span>
                  )
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* PAYMENT METHODS */}
        <Form.List name="paymentMethods">
          {(fields, { add, remove }) => (
            <>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
                style={{ marginBottom: 16 }}
              >
                Add payment method
              </Button>

              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  orientation="vertical"
                  style={{ width: "100%", marginBottom: 16 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Type"
                      options={paymentMethodOptions}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Phone / user / info" />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ color: "red", alignSelf: "flex-end" }}
                  />
                </Space>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 32 }}>
          <Button
            style={{
              background: "#46AF50",
              borderColor: "#46AF50",
              color: "white",
            }}
            type="primary"
            htmlType="submit"
            size="large"
            disabled={loading}
            icon={<TrophyFilled />}
            block
          >
            {loading ? <LoadingSpinner /> : "Add match"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateMatchForm;
