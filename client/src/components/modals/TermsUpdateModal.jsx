import { useAuth } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, message, Modal, Typography } from 'antd'
import { useEffect, useState } from "react";
import { acceptTerms } from "../../actions/auth";
import TermsAndConditions from "../../pages/auth/TermsAndConditions";

const { Text, Paragraph, Link } = Typography;

const TermsUpdateModal = ({ open, currentVersion }) => {

    const { loadUser, logout } = useAuth();
    const navigate = useNavigate();

    const [openTerms, setOpenTerms] = useState(false);
    const [disabledCheck, setDisabledCheck] = useState(true);
    const [checked, setChecked] = useState(false)
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (open) {
            setOpenTerms(false)
            setDisabledCheck(true)
            setChecked(false)
        }
    }, [open]);

    const handleAccept = async () => {
        if (!checked) return;

        setAccepting(true);

        try {
            await acceptTerms();
            await loadUser();
            message.success('Thank you for accepting updated Terms and Conditions')
        } catch (error) {
            message.error(error?.response?.data?.message || 'We could not save your acceptance please try again later')
        } finally {
            setAccepting(false)
        }
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true })
    }

    return (
        <>
            <Modal
                title="New Terms and Conditions available"
                open={open}
                centered
                closable={false}
                keyboard={false}
                mask={{closable: false}}
                footer={[
                    <>
                        <Button key="logout" onClick={handleLogout} disabled={accepting}>
                            Logout
                        </Button>
                        <Button
                            key="accept"
                            type="primary"
                            onClick={handleAccept}
                            loading={accepting}
                            disabled={!checked}
                        >
                            Accept and continue
                        </Button>
                    </>
                ]}
            >
                <Paragraph>
                    Our Terms and Conditions have changed. Please read them and accept
                    them to keep using Weekly Tennis.
                </Paragraph>

                <Paragraph>
                    <Link onClick={() => setOpenTerms(true)}>
                        Read the Terms and Conditions
                    </Link>
                </Paragraph>

                <Checkbox
                    checked={checked}
                    disabled={disabledCheck}
                    onChange={(e) => setChecked(e.target.checked)}
                >
                    I have read and agree to the updated Terms and Conditions
                </Checkbox>

                {disabledCheck && (
                    <Text type="secondary" style={{display: 'block', marginTop: 8, fontSize: 12}}>
                        Please open and read the Terms and Conditions to enable this option
                    </Text>
                )}

                {currentVersion && (
                    <Text type="secondary" style={{display: 'block', marginTop: 12, fontSize: 12}}>
                        Version: {currentVersion}
                    </Text>
                )}
            </Modal>

            <TermsAndConditions
                open={openTerms}
                readButton={true}
                setOpenModal={setOpenTerms}
                setDisabledCheck={setDisabledCheck}
                closable={false}
            />
        </>
    )
}

export default TermsUpdateModal