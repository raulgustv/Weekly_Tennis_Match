
import { Col, Divider, Row, Typography , Grid} from 'antd';
import { useAllTransactions, usePendingTransactions } from '../../hooks/useTransactions';
import PendingTransactions from '../../components/wallet/PendingTransactions';
import { acceptTransaction, rejectTransaction } from '../../actions/wallet';
import { toast } from 'react-toastify'
import { useState } from 'react';
import TransactionsTable from '../../components/wallet/TransactionsTable';

const WalletAdmin = () => {

    const { Title } = Typography

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const { pendingTransactions, fetchPendingTransactions, loadPendingTransactions, setLoadPendingTransactions } = usePendingTransactions();
    const { transactions, loadTransactions, fetchAllTransactions } = useAllTransactions();



    const [openInputId, setOpenInputId] = useState(null)
    const [note, setNote] = useState("")

    console.log(transactions)


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

    return (
        <>
            <Title level={3}>
                Manage transactions
            </Title>

            

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