import {
    Button,
    Card,
    Flex,
    Typography,
    Grid,
    Input,
    Select,
    Tooltip,
} from "antd";
import {
    PlusCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { addFunds } from "../../actions/wallet";
import { toast } from "react-toastify";
import { useWalletBalance } from "../../hooks/useTransactions";

const WalletBalance = ({
    balance,
    fetchTransactions,
    loading,
    setLoading,
}) => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("bizum");
    const [refreshingBalance, setRefreshingBalance] =
        useState(false);

    const { Text, Title } = Typography;

    const {
        fetchWalletBalance,
        loadWallet,
    } = useWalletBalance();

    const handleAddFunds = () => {
        setShowForm((prev) => !prev);
    };

    const handleRefreshBalance = async () => {
        try {
            setRefreshingBalance(true);

            await fetchWalletBalance();
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                    "Unable to refresh balance"
            );
        } finally {
            setRefreshingBalance(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = {
                amount: Number(amount),
                method,
            };

            await addFunds(payload);

            toast.success(
                "Your request to send funds has been sent"
            );

            fetchTransactions();
            setShowForm(false);
        } catch ({ response }) {
            console.log(response);

            setLoading(false);

            toast.error(
                response?.data?.message
            );

            setShowForm(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Flex
                vertical={!screens.md}
                justify="space-around"
                align={
                    screens.md
                        ? "center"
                        : "flex-start"
                }
                gap={16}
            >
                {/* ================= BALANCE ================= */}

                <Flex
                    vertical
                    style={{
                        minWidth: 0,
                    }}
                >
                    <Text type="secondary">
                        Available balance
                    </Text>

                    <Flex
                        align="center"
                        gap={8}
                        style={{
                            marginTop: 2,
                        }}
                    >
                        <Title
                            level={5}
                            style={{
                                margin: 0,
                                minWidth: 90,
                            }}
                        >
                            €{balance.toFixed(2)}
                        </Title>

                        <Tooltip title="Refresh balance">
                            <Button
                                type="text"
                                size="small"
                                shape="circle"
                                icon={
                                    <ReloadOutlined
                                        spin={
                                            refreshingBalance ||
                                            loadWallet
                                        }
                                    />
                                }
                                loading={
                                    refreshingBalance
                                }
                                onClick={
                                    handleRefreshBalance
                                }
                                aria-label="Refresh balance"
                                style={{
                                    transition:
                                        "all .25s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "rotate(20deg) scale(1.08)";
                                    e.currentTarget.style.background =
                                        "rgba(124,179,66,.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "rotate(0deg) scale(1)";
                                    e.currentTarget.style.background =
                                        "transparent";
                                }}
                            />
                        </Tooltip>
                    </Flex>
                </Flex>

                {/* ================= ADD FUNDS ================= */}

                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    size="large"
                    block={!screens.md}
                    onClick={handleAddFunds}
                >
                    Add funds
                </Button>

                {/* ================= FORM ================= */}

                {showForm && (
                    <Flex
                        vertical={!screens.md}
                        gap={12}
                        style={{
                            marginTop: 16,
                            width: "100%",
                        }}
                    >
                        <Input
                            placeholder="Amount (€)"
                            type="number"
                            value={amount}
                            onChange={(e) =>
                                setAmount(
                                    e.target.value
                                )
                            }
                        />

                        <Select
                            value={method}
                            onChange={setMethod}
                            options={[
                                {
                                    value: "bizum",
                                    label: "Bizum",
                                },
                                {
                                    value: "revolut",
                                    label: "Revolut",
                                },
                                {
                                    value: "paypal",
                                    label: "Paypal",
                                },
                                {
                                    value: "cash",
                                    label: "Cash",
                                },
                            ]}
                        />

                        <Button
                            onClick={handleSubmit}
                            loading={loading}
                            type="primary"
                        >
                            Confirm
                        </Button>

                        <Button
                            onClick={() => {
                                setShowForm(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};

export default WalletBalance;