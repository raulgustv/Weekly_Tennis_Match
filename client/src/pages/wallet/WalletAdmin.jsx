import {
    Col,
    Divider,
    Row,
    Typography,
    Select,
    Grid,
    Button,
    Flex,
    Tag
} from 'antd';
import {
    useAllTransactions,
    usePendingTransactions
} from '../../hooks/useTransactions';
import PendingTransactions from '../../components/wallet/PendingTransactions';
import { useState, useEffect } from 'react';
import TransactionsTable from '../../components/wallet/TransactionsTable';
import axiosInstance from '../../API/axios';
import { toast } from 'react-toastify';
import { updatePaymentRecepient } from '../../actions/admin';

const WalletAdmin = () => {

    const { Title } = Typography;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const {
        pendingTransactions,
        fetchPendingTransactions,
        loadPendingTransactions,
        setLoadPendingTransactions
    } = usePendingTransactions();

    const {
        transactions,
        loadTransactions,
        fetchAllTransactions
    } = useAllTransactions();

    // ✅ estados separados (clave)
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    // 🔥 obtener admins
    const obtainAdmins = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/get-admin');
            setAdmins(data);
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    };

    useEffect(() => {
        obtainAdmins();
    }, []);

    // 👉 admin actual
    const paymentAdmin = admins.find((a) => a?.receivesPayment === true);

    // 🚀 update admin
    const handleUpdate = async () => {
        if (!selectedAdmin) return;

        try {
            setLoadingUpdate(true);

            const res = await updatePaymentRecepient(selectedAdmin);   

            toast.success(res?.message || 'Payment admin updated');

            await obtainAdmins(); // refresca lista
            setSelectedAdmin(null);

        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <>
            <Title level={3}>Manage transactions</Title>

            <div style={{ marginBottom: 16 }}>
                <Title level={5}>
                    Payment admin:{' '}
                    {paymentAdmin ? (
                        <>
                            {paymentAdmin.name} {paymentAdmin.lastname}{' '}
                            <Tag color="green">Current</Tag>
                        </>
                    ) : (
                        <Tag color="red">Not assigned</Tag>
                    )}
                </Title>
            </div>

            <Flex gap={8} align="center" wrap="wrap">

                <Select
                    value={selectedAdmin}
                    placeholder="Select an admin"
                    style={{ width: 260 }}
                    options={admins.map((ad) => ({
                        value: ad._id,
                        label: (
                            <Flex justify="space-between">
                                <span>{ad.name} {ad.lastname}</span>
                                {ad.receivesPayment && (
                                    <Tag color="green">Current</Tag>
                                )}
                            </Flex>
                        )
                    }))}
                    onChange={(value) => setSelectedAdmin(value)}
                />

                <Button
                    type="primary"
                    disabled={!selectedAdmin}
                    loading={loadingUpdate}
                    onClick={handleUpdate}
                >
                    Update
                </Button>

            </Flex>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <PendingTransactions
                        transactions={pendingTransactions}
                        setLoading={setLoadPendingTransactions}
                        loading={loadPendingTransactions}
                        fetchTransactions={fetchPendingTransactions}
                    />
                </Col>

                <Col xs={24} md={12}>
                    <TransactionsTable
                        transactions={transactions}
                        isMobile={!screens.md}
                        loading={loadTransactions}
                        isAdmin={true}
                        refresh={fetchAllTransactions}
                    />
                </Col>
            </Row>
        </>
    );
};

export default WalletAdmin;