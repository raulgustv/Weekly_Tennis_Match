import { Alert, Typography } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../context';
import VerifyAccountModal from '../modals/VerifyAccountModal';


const { Text, Link } = Typography;

const AlertNotVerified = ({ name, email, isVerified }) => {
    const { loadUser } = useAuth();
    const [openModal, setOpenModal] = useState(false);

    if (isVerified) return null;

    return (
        <>
            <Alert
                title="Your account is not verified"
                description={
                    <div>
                        <Text>
                            It seems your account is still not verified. Please click here to enter your verification code
                        </Text>
                        <br />
                        <Link onClick={() => setOpenModal(true)}>
                            Verify account
                        </Link>
                    </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <VerifyAccountModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                email={email}
                onVerified={async () => {
                    setOpenModal(false);
                    await loadUser();
                }}
            />
        </>
    );
};

export default AlertNotVerified;