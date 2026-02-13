import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, Progress } from 'antd';
import { resetPassword } from "../../actions/auth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context";
import useRedirectProgress from '../../hooks/useRedirectProgress.js'


const ResetPassword = () => {

  const [form] = Form.useForm();
  const { Text, Title } = Typography;
  const { token } = useParams();
  const navigate = useNavigate()

  const { user } = useAuth();
  
  const redirect = useRedirectProgress({
    duration: 3000,
    onFinish: () => {
      navigate(user ? "/dashboard" : '/login')
    }
  })

  const handleReset = async (values) => {
    try {

      const res = await resetPassword(values, token)

      toast.success(res?.message);

      form.resetFields();
      redirect.start(); 

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)

    } 
  }



  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <Title level={3} style={{ textAlign: 'center' }}>Reset password</Title>

        <Text
          type="secondary"
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: 24
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
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your password" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New password"
            />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Password confirmation is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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

          <Form.Item>
            <Button type="primary" block size="large" htmlType="submit">
              {redirect.active ? "Redirecting in..." : "Change password"}
              
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
  )
}


const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0f2f5, #e6f7ff)",
  },
  card: {
    width: 380,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
};

export default ResetPassword