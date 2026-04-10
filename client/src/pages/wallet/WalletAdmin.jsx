
import { Col, Divider, Row, Typography, Select, Grid } from 'antd';
import { useAllTransactions, usePendingTransactions } from '../../hooks/useTransactions';
import PendingTransactions from '../../components/wallet/PendingTransactions';
import { useState, useEffect } from 'react';
import TransactionsTable from '../../components/wallet/TransactionsTable';
import axiosInstance from '../../API/axios';

const WalletAdmin = () => {

    const { Title, Text } = Typography

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const { pendingTransactions, fetchPendingTransactions, loadPendingTransactions, setLoadPendingTransactions } = usePendingTransactions();
    const { transactions, loadTransactions, fetchAllTransactions } = useAllTransactions();

    
    const [admin, setAdmin] = useState([])
    //console.log(transactions)


    //console.log(fetchPendingTransactions)    

    const obtainAdmins = async () => {
        try {

            const { data } = await axiosInstance.get('/admin/get-admin')

            setAdmin(data)

        } catch (error) {
            console.log(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        obtainAdmins()
    }, []);

    //console.log(admin)

    return (
        <>
            <Title level={3}>
                Manage transactions
            </Title>

            <div>
                <Text>Payment admin: </Text>
                {admin.length > 0 && (
                    <Select
                        defaultValue={`${admin.find(a => a.receivesPayment)?.name} ${admin.find(a => a.receivesPayment)?.lastname}`}
                        options={admin.map((ad) => ({
                            value: `${ad.name} ${ad.lastname}`,
                            label: `${ad.name} ${ad.lastname}`
                        }))}
                        style={{ width: 200 }}
                    />
                )}
            </div>

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
    )
}

export default WalletAdmin