import { Button, Form, Input, Typography } from "antd";
import { login } from "../../actions";
import { useState } from "react";
import { useAuth } from '../../context'
import { toast } from 'react-toastify'
import { useNavigate, Navigate } from "react-router-dom";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import ResetPasswordModal from "../../components/modals/ResetPasswordModal";
//import { auth, googleProvider } from "../../config/firebase";
//import { signInWithPopup } from "firebase/auth";
//import { googleLogin } from "../../actions/auth";
//import CompleteProfile from "../../components/modals/CompleteProfile";

const Login = () => {

  const navigate = useNavigate();
  const {Link} = Typography

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false)
  //const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  //const [pendingUser, setPendingUser] = useState(null)
  //const [pendingToken, setPendingToken] = useState(null)
  const { setSession, isAuthenticated, user } = useAuth();




  if (isAuthenticated) {
    return user?.role === "admin"
      ? <Navigate to='/admin/dashboard' replace />
      : <Navigate to='/games' replace />
  }

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const data = await login(values);

      await setSession(data?.token)

      toast.success(`Welcome ${data?.user?.name}`);

      if (data?.user?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/games')
      }

    } catch (error) {
      //console.log(error)
      setLoading(false)
      return toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  };

  // const handleGoogleLogin = async () => {
  //   setLoading(true);

  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);

  //     const token = await result.user.getIdToken();

  //     const data = await googleLogin(token)


  //     if (!data.user?.profileComplete) {
  //       localStorage.setItem("temp_token", data?.token)

  //       setPendingUser(data.user);
  //       setPendingToken(data.token);
  //       setShowCompleteProfile(true);
  //       return;
  //     }

  //     //session
  //     setSession(data?.token, data?.user)



  //     navigate(
  //       data.user.role === "admin"
  //         ? "/admin/dashboard"
  //         : "/dashboard"
  //     );
  //   } catch (error) {
  //     console.log(error)
  //     setLoading(false)
  //   }
  // }





  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="johndoe@john.com" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <LoadingSpinner /> : "Login"}
          </Button>


          {/* GOOGLE BLOCK */}
          {/* 
            <Divider> OR </Divider>

            <Button
              block
              onClick={handleGoogleLogin}
              icon={
                <GoogleOutlined
                  style={{
                    color: "#34a853",
                    fontSize: 18,
                  }}
                />
              }
              style={{
                height: 44,
                background: "linear-gradient(135deg, #1a73e8, #4285f4)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Continue with Google
            </Button> */}

        </Form.Item>
      </Form>

      <div>
            <Link onClick={() => {setisModalOpen(true)}}>Forgot your password?</Link>
      </div>

      {/* <CompleteProfile
        open={showCompleteProfile}
        user={pendingUser}
        onComplete={handleProfileCompleted}
      /> */}


      <ResetPasswordModal openModal={isModalOpen} onClose={() => setisModalOpen(false)} />

    </div>
  );
};

export default Login;
