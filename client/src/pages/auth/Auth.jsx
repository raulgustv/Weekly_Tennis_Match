import { Card, Segmented } from "antd";
import { useState } from "react"
import { Login, Register } from './'
import {EaseAnimation} from '../../components/Animations'


const Auth = () => {

    const [mode, setMode] = useState("login");

    return (
        <div
            style={{
                height: '100%',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f5",
            }}
        >
            <Card title="Welcome to MTC" style={{ width: 380 }}>
                <Segmented
                    block
                    size="large"
                    value={mode}
                    onChange={(value) => setMode(value)}
                    options={[
                        { label: "Login", value: "login" },
                        { label: "Register", value: "register" }
                    ]}
                    style={{ marginBottom: 24 }}
                />
                <EaseAnimation
                    key={mode}
                    direction={mode === "login" ? 'left' : 'right'}
                >
                    {mode === 'login' ? <Login /> : <Register />}
                </EaseAnimation>

            </Card>
        </div>
    )
}

export default Auth
