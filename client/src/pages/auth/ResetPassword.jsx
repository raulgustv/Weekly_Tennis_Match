import { LockOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Progress,
} from "antd";
import { resetPassword } from "../../actions/auth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context";
import useRedirectProgress from "../../hooks/useRedirectProgress.js";

const ResetPassword = () => {
  const [form] = Form.useForm();

  const { Text, Title } = Typography;

  const { token } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const redirect = useRedirectProgress({
    duration: 3000,
    onFinish: () => {
      navigate(user ? "/dashboard" : "/login");
    },
  });

  const handleReset = async (values) => {
    try {
      const res = await resetPassword(
        {
          newPassword: values.newPassword,
        },
        token
      );

      toast.success(res?.message);

      form.resetFields();

      redirect.start();
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <Title
          level={3}
          style={{ textAlign: "center" }}
        >
          Reset password
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Enter your new password
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleReset}
          disabled={redirect.active}
        >
          {/* NEW PASSWORD */}
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                min: 8,
                message:
                  "Password must be at least 8 characters",
              },
              {
                pattern: /[A-Z]/,
                message:
                  "Password must contain at least one uppercase letter",
              },
              {
                pattern: /[a-z]/,
                message:
                  "Password must contain at least one lowercase letter",
              },
              {
                pattern: /[0-9]/,
                message:
                  "Password must contain at least one number",
              },
              {
                pattern: /[^A-Za-z0-9]/,
                message:
                  "Password must contain at least one special character",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New password"
            />
          </Form.Item>

          {/* CONFIRM PASSWORD */}
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message:
                  "Password confirmation is required",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("newPassword") === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm password"
            />
          </Form.Item>

          {/* BUTTON */}
          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              htmlType="submit"
            >
              {redirect.active
                ? "Redirecting in..."
                : "Change password"}
            </Button>

            {redirect.active && (
              <div style={{ marginTop: 16 }}>
                <Progress
                  percent={Math.round(redirect.progress)}
                  status="active"
                />

                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Redirecting…
                </Text>
              </div>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f0f2f5, #e6f7ff)",
  },

  card: {
    width: 380,
    borderRadius: 12,
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },
};

export default ResetPassword;