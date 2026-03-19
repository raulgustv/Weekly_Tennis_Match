import { useState } from "react";
import { Button, Checkbox, Form, Input, Select, Space, Steps, Typography } from "antd";
import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import NTRPLevel from "../../components/utils/NTRPLevel";
import { register, checkEmailValidity } from "../../actions/auth";
import { useAuth } from "../../context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCountries } from "../../hooks/useCountries";
import LoadingSpinner from "../../components/utils/LoadingSpinner";

const Register = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const { countries, loadCountries } = useCountries();
  const [emailStatus, setEmailStatus] = useState("idle");

  const {Link} = Typography;
  
  const navigate = useNavigate();

  /* -----------------------------
     SINCRONIZAR PREFIX AUTOMÁTICO
  ------------------------------*/
  // useEffect(() => {
  //   if (!countries.length) return;

  //   const selectedCountry = form.getFieldValue("country");
  //   if (!selectedCountry) return;

  //   const country = countries.find(c => c.name === selectedCountry);

  //   if (country?.phoneCodes?.length) {
  //     form.setFieldsValue({
  //       prefix: country.phoneCodes[0]
  //     });
  //   }
  // }, [countries, form]);

  const renderEmailIcon = () => {
    switch (emailStatus) {
      case "loading":
        return <LoadingOutlined />;
      case "valid":
        return <CheckOutlined style={{ color: "green" }} />;
      case "invalid":
        return <CloseOutlined style={{ color: "red" }} />;
      default:
        return <span style={{ width: 16 }} />;
    }
  };

  const stepItems = [
    { title: "Account" },
    { title: "Personal info" },
    { title: "Tennis level" }
  ];

  // const onCountryChange = (countryName) => {
  //   const country = countries.find(c => c.name === countryName);
  //   if (country?.phoneCodes?.length) {
  //     form.setFieldsValue({
  //       prefix: country.phoneCodes[0]
  //     });
  //   }
  // };

  const prefixSelector = (
    <Form.Item
      name="prefix"
      initialValue="+34"
      rules={[{ required: true, message: "Prefix required" }]}
      noStyle
    >
      <Select
        showSearch
        style={{ width: 110 }}
        placeholder="+34"
        options={
          countries
            .flatMap(c =>
              c.phoneCodes.map(code => ({
                key: code,
                label: `${code}`,
                 value: `${code}-${c.iso}` 
              }))
            )
            .sort((a, b) => a.label.localeCompare(b.label))
        }
      />
    </Form.Item>
  );

  const next = async () => {
    try {
      if (current === 0) {
        await form.validateFields([
          "email",
          "password",
          "confirmPassword"
        ]);
      }

      if (current === 1) {
        await form.validateFields([
          "name",
          "lastname",
          "country",
          "gender",
          "phone",
          "prefix"
        ]);
      }

      setCurrent(prev => prev + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const prev = () => setCurrent(prev => prev - 1);

  const validateEmail = async (email) => {
    if (!email) {
      setEmailStatus("idle");
      return Promise.resolve();
    }

    try {
      setEmailStatus("loading");

      const available = await checkEmailValidity(email);

      if (!available) {
        setEmailStatus("invalid");
        return Promise.reject(new Error("Email already in use"));
      }

      setEmailStatus("valid");
      return Promise.resolve();

    } catch (error) {
      setEmailStatus("invalid");
      return Promise.reject(new Error("Error occurred validating email"));
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);

    const payload = {
      email: values.email,
      password: values.password,
      name: values.name,
      lastname: values.lastname,
      country: values.country,
      gender: values.gender,
      phone: `${values.prefix} ${values.phone}`,
      ntrplvl: values.ntrplvl,
      termsAndConditions: values.termsAndConditions
    };

    try {
      const data = await register(payload);

      setSession(data?.token);

      toast.success(`Registration complete, welcome ${data?.user?.name}`);

      navigate("/games");
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Steps
        current={current}
        items={stepItems}
        size="small"
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        name="register"
        layout="vertical"
        preserve
        onFinish={handleRegister}
        initialValues={{
          country: "Spain"
        }}
      >
        {/* STEP 1 */}
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <Form.Item
            label="Email"
            name="email"
            validateTrigger="onBlur"
            rules={[
              { type: "email", message: "Please use a valid email format" },
              { required: true, message: "Email is required" },
              { validator: (_, value) => validateEmail(value) }
            ]}
          >
            <Input placeholder="johndoe@john.com" suffix={renderEmailIcon()} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be 6 characters long" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
        </div>

        {/* STEP 2 */}
        <div style={{ display: current === 1 ? "block" : "none" }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="lastname" label="Lastname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Country"
              loading={loadCountries}
              //onChange={onCountryChange}
              options={countries.map(c => ({
                label: c.name,
                value: c.name
              }))}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone number"
            rules={[{ required: true }]}
          >
            <Space.Compact block>
              {prefixSelector}
              <Input />
            </Space.Compact>
          </Form.Item>
        </div>

        {/* STEP 3 */}
        <div style={{ display: current === 2 ? "block" : "none" }}>
          <NTRPLevel />

          <Form.Item
            name="termsAndConditions"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                      new Error("You must accept the terms and conditions")
                    ),
              },
            ]}
          >
            <Checkbox>
              I have read and accept the <Link href="/terms-and-conditions" target="_blank">Terms and Conditions</Link>
            </Checkbox>
          </Form.Item>
        </div>

        {/* ACTIONS */}
        <Space orientation="vertical" style={{ width: "100%", marginTop: 16 }}>
          {current > 0 && (
            <Button onClick={prev} block>
              Back
            </Button>
          )}

          {current < 2 && (
            <Button type="primary" onClick={next} block>
              Next
            </Button>
          )}

          {current === 2 && (
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <LoadingSpinner /> : "Register"}
            </Button>
          )}
        </Space>
      </Form>
    </>
  );
};

export default Register;
