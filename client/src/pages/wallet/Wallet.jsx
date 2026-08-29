import { Col, Row, Grid, Card, Alert } from "antd"
import { useAuth } from "../../context";
import WalletBalance from "../../components/wallet/WalletBalance";
import TransactionsTable from "../../components/wallet/TransactionsTable";
import { useTransactions } from "../../hooks/useTransactions";


const Wallet = () => {

    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();

    const { user } = useAuth();

    //console.log(user)

    const { transactions, fetchTransactions, loadWallet, setLoadWallet } = useTransactions();

    return (
        <>
            <Alert
                title='How wallet works'
                type="info"
                showIcon
                description={
                    <div>
                        <b>Note: This feature does not automatically send money via Bizum, PayPal, or any other payment method.</b>

                        <p>
                            Instead of making a separate payment for every match, you can send a larger
                            amount to the organizer in advance and keep the funds in your wallet for
                            future matches.
                        </p>

                        <ol>
                            <li>
                                <strong>Make a payment:</strong> Pay the organizer via Bizum, PayPal,
                                or any other available payment method.
                            </li>

                            <li>
                                <strong>Submit your payment:</strong> Click "Add Funds" and select the
                                payment method you used to send the money. For example, if you sent a
                                Bizum to the organizer, select Bizum.
                            </li>

                            <li>
                                <strong>Payment confirmation:</strong> You and the organizer will receive
                                a confirmation that the payment has been submitted.
                            </li>

                            <li>
                                <strong>Funds are added:</strong> Once the organizer confirms that the
                                payment has been received, the amount will be added to your wallet balance.
                            </li>

                            <li>
                                <strong>Get notified:</strong> You will receive an email notification
                                once your wallet has been credited.
                            </li>
                        </ol>

                        <p>
                            <strong>Important:</strong> Wallet funds are intended for future matches only
                            and cannot be used to pay for matches that have already been played.
                        </p>
                    </div>
                }
            />
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
                            isAdmin={false}
                            refresh={fetchTransactions}
                        />
                    </Card>
                </Col>


            </Row>
        </>
    )
}

export default Wallet