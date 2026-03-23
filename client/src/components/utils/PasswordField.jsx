import { Form, Input, Progress, Typography } from "antd";
import { useState } from "react"
import { calculateStrength, getStrengthLevel } from "../../helpers/passwordStrength";


const PasswordField = () => {

    const { Text } = Typography;

    const [strength, setStrength] = useState(0);

    const level = getStrengthLevel(strength);

    return (
        <>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Password is required" },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (value.length < 6 || value.length > 80) {
                                return Promise.reject(
                                    new Error("Password must be between 6 and 80 characters")
                                );
                            }

                            if (!/[A-Z]/.test(value)) {
                                return Promise.reject(
                                    new Error("Password must contain at least one uppercase letter")
                                );
                            }

                            if (!/[a-z]/.test(value)) {
                                return Promise.reject(
                                    new Error("Password must contain at least one lowercase letter")
                                );
                            }

                            if (!/[0-9]/.test(value)) {
                                return Promise.reject(
                                    new Error("Password must contain at least one number")
                                );
                            }

                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input.Password
                    onChange={(e) => {
                        const val = e.target.value;
                        setStrength(calculateStrength(val))
                    }}
                />
            </Form.Item>

            {
                strength > 0 && (
                    <div style={{ marginTop: -10, marginBottom: 16 }}>
                        <Progress
                            percent={strength}
                            showInfo={false}
                            strokeColor={level.color}
                        />
                        <Text style={{color: level.color}}>
                            {level.label}
                        </Text>
                    </div>
                )
            }
        </>


    )
}

export default PasswordField