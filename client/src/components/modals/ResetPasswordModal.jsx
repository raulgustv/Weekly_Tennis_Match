import { Input, Modal, Typography, Progress } from "antd"
import { useState } from "react"
import { resetPasswordEmail } from "../../actions/auth"
import { toast } from "react-toastify"
import useCountdown from "../../hooks/useCountdown"
import { formatTimeMs } from "../../helpers/time"


const ResetPasswordModal = ({ openModal, onClose }) => {

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(null)

  const {Text} = Typography

  const total_cooldown = 60000

  const resetCooldown = useCountdown({
    duration: total_cooldown
  })

  const percent = resetCooldown.active
    ? 100 - Math.round((resetCooldown.remaining / total_cooldown) * 100)
    : 0;

  const handleResetPassword = async () => {
    try {
      setLoading(true)
      await resetPasswordEmail(email)

      toast.success(`Email sent to ${email} (Please check spam folder)`)

      onClose()
      resetCooldown.start();
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      {
        !resetCooldown.active ? (
          <Modal
            open={openModal}
            onCancel={onClose}
            title="Reset password email"
            loading={loading}
            okText="Send reset link"
            onOk={handleResetPassword}
            destroyOnHidden={true}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@email.com"
            />
          </Modal>
        ) : (
          <div style={{ marginTop: 12 }}>
            <Progress
              percent={percent}
              status="active"
              showInfo={false}
            />

            <Text
              type="danger"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 6,
                fontsize: 12
              }}
            >
              Link to send password disabled. Retry in {formatTimeMs(resetCooldown.remaining)}
            </Text>
          </div>
        )
      }

    </>
  )
}

export default ResetPasswordModal