import { Modal, Typography, Input, Button, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { sendTokenEmail, verifyCode } from '../../actions/auth';

const { Text, Link } = Typography;

const VerifyAccountModal = ({ open, onClose, email, onVerified, autoSend = true }) => {
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    // evita reenviar dos veces si el modal re-renderiza mientras está abierto
    const sentForThisOpenRef = useRef(false);

    // ref al contenedor del OTP para forzar teclado numérico en mobile (Android/iOS)
    const otpWrapperRef = useRef(null);

    useEffect(() => {
        if (open) {
            setCode('');
            setError(null);

            if (autoSend && !sentForThisOpenRef.current) {
                sentForThisOpenRef.current = true;
                triggerSend({ silent: true });
            }
        } else {
            sentForThisOpenRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // fuerza teclado numérico en cada input real del OTP (Android/iOS)
    useEffect(() => {
        if (otpWrapperRef.current) {
            const inputs = otpWrapperRef.current.querySelectorAll('input');
            inputs.forEach((input) => {
                input.setAttribute('inputmode', 'numeric');
                input.setAttribute('pattern', '[0-9]*');
            });
        }
    }, [open, code]);

    const startCooldown = () => {
        setCooldown(60);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const triggerSend = async ({ silent = false } = {}) => {
        setResending(true);
        setError(null);

        try {
            await sendTokenEmail();
            if (!silent) message.success('Code has been resent');
            startCooldown();
        } catch (err) {
            setError(err.response?.data?.message || 'We are unable to send your code');
        } finally {
            setResending(false);
        }
    };

    const handleVerify = async (value) => {
        const otpValue = value ?? code;

        if (!otpValue || otpValue.length !== 6) {
            setError('Pleasea enter the 6 digit code');
            return;
        }

        setVerifying(true);
        setError(null);

        try {
            await verifyCode(otpValue);
            message.success('Your account has been verified');
            setCode('');
            onVerified?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
            setCode('');
        } finally {
            setVerifying(false);
        }
    };

    const handleOtpChange = (value) => {
        setCode(value);
        setError(null);

        if (value.length === 6) {
            handleVerify(value);
        }
    };

    const handleClose = () => {
        setCode('');
        setError(null);
        onClose?.();
    };

    return (
        <Modal
            title="Verify your account"
            open={open}
            onCancel={handleClose}
            closable
            footer={null}
        >
            <Text>
                We've sent a verification code to {email}. Please enter this code to finish account verification.
            </Text>

            <div ref={otpWrapperRef} style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                <Input.OTP
                    length={6}
                    value={code}
                    onChange={handleOtpChange}
                    disabled={verifying}
                    size="large"
                    status={error ? 'error' : ''}
                />
            </div>

            {error && (
                <Text type="danger" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
                    {error}
                </Text>
            )}

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link onClick={() => triggerSend()} disabled={resending || cooldown > 0}>
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code '}
                </Link>

                <Button type="primary" loading={verifying} onClick={() => handleVerify()} disabled={code.length !== 6}>
                    Verify
                </Button>
            </div>
        </Modal>
    );
};

export default VerifyAccountModal;