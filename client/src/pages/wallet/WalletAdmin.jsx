
import { Col, Divider, Row, Typography, Select, Grid } from 'antd';
import { useAllTransactions, usePendingTransactions } from '../../hooks/useTransactions';
import PendingTransactions from '../../components/wallet/PendingTransactions';
import { acceptTransaction, rejectTransaction } from '../../actions/wallet';
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react';
import TransactionsTable from '../../components/wallet/TransactionsTable';
import axiosInstance from '../../API/axios';

const WalletAdmin = () => {

    const { Title, Text } = Typography

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const { pendingTransactions, fetchPendingTransactions, loadPendingTransactions, setLoadPendingTransactions } = usePendingTransactions();
    const { transactions, loadTransactions, fetchAllTransactions } = useAllTransactions();



    const [openInputId, setOpenInputId] = useState(null)
    const [note, setNote] = useState("")
    const [admin, setAdmin] = useState([])


    //console.log(transactions)


    //console.log(pendingTransactions)

    const handleApprove = async (id) => {
        try {
            setLoadPendingTransactions(true)
            const { data } = await acceptTransaction(id);

            toast.success(data?.message)

            fetchPendingTransactions();

        } catch ({ response }) {
            toast.error(response?.data?.message)
        } finally {
            setLoadPendingTransactions(false)
        }
    }

    const handleOpenNote = (id) => {
        setOpenInputId(id)
    }

    const handleCancel = () => {
        setOpenInputId(null)
        setNote(null)
    }

    const handleReject = async (id) => {
        try {
            setLoadPendingTransactions(true)
            await rejectTransaction(id, note)

            fetchPendingTransactions();
            setNote(null)

            toast.success('Transction rejected')
        } catch ({ response }) {
            toast.error(response?.data?.message)
        } finally {
            setLoadPendingTransactions(true)
        }
    }

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
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                        openInputId={openInputId}
                        handleOpenNote={handleOpenNote}
                        note={note}
                        setNote={setNote}
                        handleCancel={handleCancel}
                        loading={loadPendingTransactions}
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