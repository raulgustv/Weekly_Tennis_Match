import { Card, Form, Input, InputNumber, Button } from "antd";
import { PushpinOutlined } from "@ant-design/icons";
import LoadingSpinner from "../utils/LoadingSpinner";
//import { useState } from "react";
//import axiosInstance from "../../API/axios";

const CourtForm = ({ onCreate, loading }) => {
  const [form] = Form.useForm();

  //const [shortening, setShortening] = useState(false)

  const handleFinished = async (values) => {
    await onCreate(values);
    form.resetFields();
  };

  // const handlePasteLink = async (e) => {
  //   try {
  //     const pastedText = e.clipboardData.getData("text").trim()

  //     let validatedURL

  //     validatedURL = new URL(pastedText)

  //     setShortening(true)

  //     const response = await axiosInstance.post(
  //       '/location/shorten', {
  //       longUrl: validatedURL.href
  //     }
  //     )

  //     form.setFieldValue("address", response.data.shortUrl)

  //   } catch (error) {
  //     console.log(error)
  //     setShortening(false)
  //   }finally{
  //     setShortening(false)
  //   }
  // }

  return (
    <Card title="Add new court location" style={{ width: "100%" }}>
      <Form layout="vertical" form={form} onFinish={handleFinished}>
        <Form.Item
          label="Location"
          name="name"
          rules={[
            { required: true, message: "Court name is required" },
            {
              min: 5,
              max: 500,
              message:
                "Court address must be between 3 and 500 characters long",
            },
          ]}
        >
          <Input placeholder="Casa de campo" />
        </Form.Item>

        <Form.Item
          label="Google maps link"
          name="address"
          rules={[
            { required: true, message: "Google maps link is required" },
            {
              min: 5,
              max: 6000,
              message:
                "Court address must be between 3 and 500 characters long",
            },
          ]}
        >
          <Input
            placeholder="https://maps.google.com"
            //onPaste={handlePasteLink}
            // suffix={
            //   shortening ? (<LoadingSpinner />) : null
            // }
          />
        </Form.Item>

        <Form.Item
          label="Total courts"
          name="courts"
          rules={[
            { required: true, message: "Please add total # of courts" },
            { type: "number", min: 1, message: "At least one court" },
            { type: "number", max: 50, message: "Max 50 courts" },
          ]}
        >
          <InputNumber
            placeholder="5"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PushpinOutlined />}
            style={{
              background: "#46AF50",
              borderColor: "#46AF50",
              color: "white",
              width: "100%",
            }}
            size="large"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner color="#3C638E" />
            ) : (
              "Add court"
            )}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourtForm;
