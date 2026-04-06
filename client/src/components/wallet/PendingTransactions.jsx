import { Button, Card, Flex, Tag, Typography, Grid, Input, Empty } from "antd";
import dayjs from "dayjs";
import colors from "../../themes/colors";

const PendingTransactions = ({ transactions = [], 
    handleApprove, 
    handleReject, 
    openInputId, 
    handleOpenNote, 
    note, 
    setNote, 
    handleCancel,
    loading
}) => {
    const { Text } = Typography;
    const { Meta } = Card;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    if (!transactions.length) {
        return (
            <Card title="Pending approvals">
                <Empty description="No pending transactions to approve" />
            </Card>
        );
    }

    return (
        <Card title="Pending approvals" size="small" loading={loading}>
            <Flex vertical gap={12}>
                {transactions.map((tx) => (
                    <Card
                        key={tx?._id}
                        size="small"
                        title={
                            <Text strong>
                                {tx?.user?.name} {tx?.user?.lastname}
                            </Text>
                        }
                    >
                        {/* USER INFO */}
                        <Meta
                            description={
                                <Text type="secondary">
                                    {tx?.user?.email} | {tx?.user?.phone}
                                </Text>
                            }
                            style={{ marginBottom: 12 }}
                        />

                        {/* MAIN CONTENT */}
                        <Flex vertical gap={8}>
                            {/* AMOUNT + STATUS */}
                            <Flex justify="space-between" align="center">
                                <Text strong style={{ fontSize: 16 }}>
                                    €{tx?.amount.toFixed(2)}
                                </Text>

                                <Tag color="orange">{tx?.status}</Tag>
                            </Flex>

                            {/* METHOD + DATE */}
                            <Flex
                                justify="space-between"
                                wrap
                                gap={6}
                            >
                                <Text type="secondary">{tx?.method}</Text>

                                <Text type="secondary">
                                    {dayjs(tx?.createdAt).format("DD/MM HH:mm")}
                                </Text>
                            </Flex>

                            {/* ACTIONS */}
                            <Flex
                                gap={8}
                                vertical={!screens.md}
                            >
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="round"
                                    block={!screens.md}
                                    onClick={() => handleApprove(tx?._id)}
                                >
                                    Approve
                                </Button>

                                <Button
                                    size="small"
                                    shape="round"
                                    block={!screens.md}
                                    style={{ background: colors.danger, color: "white" }}
                                    onClick={() => { handleOpenNote(tx?._id) }}
                                >
                                    Decline
                                </Button>

                                {openInputId === tx?._id && (
                                    <>
                                        <Input
                                            type='text'
                                            size="small"
                                            placeholder="Enter a note"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => { handleReject(tx?._id) }}
                                            block={!screens.md}
                                        >
                                            OK
                                        </Button>

                                        <Button
                                            size="small"
                                            type="default"
                                            onClick={() => handleCancel()}
                                            block={!screens.md}
                                        >
                                            Cancel
                                        </Button>
                                    </>

                                )}


                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Card>
    );
};



export default PendingTransactions;