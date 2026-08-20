import React, { useState } from "react";
import {
  message,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Alert,
  Tooltip,
  Tag,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  BellOutlined,
  CompassOutlined,
} from "@ant-design/icons";

import { createNotification } from "../../actions/notifications";
import { TAG_STYLES } from "../../helpers/NotificationColors";

const { TextArea } = Input;

const TAG_OPTIONS = [
  "New",
  "Improvement",
  "Bug Fix",
  "Coming soon",
];

const LabelWithHint = ({ text, hint }) => (
  <Space size={4}>
    {text}

    <Tooltip title={hint}>
      <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
    </Tooltip>
  </Space>
);

const NewNotification = ({ onCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const type = Form.useWatch("type", form);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const payload = {
        type: values.type,
        title: values.title,
        description: values.description,
        tag: values.tag,
        ...(values.type === "tour" && {
          version: values.version,
          order: values.order ?? 0,
        }),
      };

      await createNotification(payload);

      message.success("Notification created successfully");

      form.resetFields();

      onCreated?.();
    } catch (err) {
      console.error("Error creating notification:", err);

      message.error(
        err?.response?.data?.message ||
          "Could not create the notification"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <BellOutlined />
          Create notification
        </Space>
      }
      style={{ maxWidth: 640 }}
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
        title="Use this only for important updates"
        description={
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            This will be shown to <strong>all users</strong> when
            they log in (Tour) or through their notification bell
            (Inbox). Avoid using it for minor changes — reserve it
            for important bug fixes, relevant new features, or
            announcements that everyone should see.

            <br />
            <br />

            <strong>Tour:</strong> appears as a step-by-step guide
            the first time a user enters the app after it has been
            created.

            <br />

            <strong>Inbox / notification bell:</strong> appears as
            a notification badge on the bell until the user opens
            their notifications.
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          tag: "New",
        }}
      >
        <Form.Item
          name="type"
          label={
            <LabelWithHint
              text="Where should it appear?"
              hint="Tour: initial step-by-step guide. Inbox: appears in the notification bell as a regular notification."
            />
          }
          rules={[
            {
              required: true,
              message:
                "Please select where the notification should appear",
            },
          ]}
        >
          <Select
            placeholder="Select a type"
            options={[
              {
                value: "tour",
                label: (
                  <Space>
                    <CompassOutlined />
                    Tour (step-by-step guide)
                  </Space>
                ),
              },
              {
                value: "update",
                label: (
                  <Space>
                    <BellOutlined />
                    Inbox / notification bell
                  </Space>
                ),
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Title is required",
            },
          ]}
        >
          <Input
            placeholder="E.g. New version available"
            maxLength={80}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Description is required",
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Briefly explain what changed and why it matters to users"
            maxLength={280}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="tag"
          label={
            <LabelWithHint
              text="Tag"
              hint="Visual only — helps users quickly identify what kind of update this is."
            />
          }
        >
          <Select
            options={TAG_OPTIONS.map((tag) => {
              const style =
                TAG_STYLES[tag] ?? TAG_STYLES.New;

              return {
                value: tag,
                label: (
                  <Tag
                    style={{
                      color: style.color,
                      background: style.background,
                      borderColor: style.border,
                    }}
                  >
                    {tag}
                  </Tag>
                ),
              };
            })}
          />
        </Form.Item>

        {type === "tour" && (
          <Space
            style={{ width: "100%" }}
            size="large"
          >
            <Form.Item
              name="version"
              initialValue="1.0.0"
              label={
                <LabelWithHint
                  text="Tour version"
                  hint={
                    <span>
                      Groups multiple steps into the same tour.
                      All steps sharing the same version are shown
                      together, one after another, as a single tour.

                      <br />
                      <br />

                      Example: if you create 3 tour notifications
                      with version "1.1.0", users will see all 3
                      together in the same tour. If you later create
                      another notification with version "1.2.0", it
                      will appear as a separate tour.
                    </span>
                  }
                />
              }
              rules={[
                {
                  required: true,
                  message: "Tour version is required",
                },
              ]}
            >
              <Input
                placeholder="1.1.0"
                style={{ width: 160 }}
              />
            </Form.Item>

            <Form.Item
              name="order"
              initialValue={0}
              label={
                <LabelWithHint
                  text="Order"
                  hint={
                    <span>
                      Defines the position of this step within the
                      same tour version. 0 is shown first, 1 second,
                      and so on.

                      <br />
                      <br />

                      If you are creating a single-step tour, you
                      can simply leave it at 0. It only matters when
                      you have multiple steps under the same version.
                    </span>
                  }
                />
              }
            >
              <InputNumber
                min={0}
                style={{ width: 100 }}
              />
            </Form.Item>
          </Space>
        )}

        <Form.Item style={{ marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
          >
            Create notification
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewNotification;