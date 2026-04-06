import { Col, Row, Grid, Card } from "antd"
import { useAuth } from "../../context";
import WalletBalance from "../../components/wallet/WalletBalance";
import TransactionsTable from "../../components/wallet/TransactionsTable";
import { useTransactions } from "../../hooks/useTransactions";


const Wallet = () => {

    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();

    const { user } = useAuth();

    const { transactions, fetchTransactions, loadWallet, setLoadWallet } = useTransactions();

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24}>
                    <WalletBalance
                        balance={user?.walletBalance}
                        fetchTransactions={fetchTransactions}
                        loading={loadWallet}
                        setLoading={setLoadWallet}
                    />
                </Col>

                <Col xs={24} md={24}>
                    <Card>
                        <TransactionsTable
                            transactions={transactions}
                            isMobile={!screens.md}
                            loading={loadWallet}
                            title=""
                        />
                    </Card>
                </Col>


            </Row>
        </>
    )
}

export default Wallet