import {
    Button,
    Flex,
    Input,
    Table,
    Tag,
    Typography,
    Tooltip,
    Grid,
    Card,
    Empty,
    Spin,
} from "antd";
import dayjs from "dayjs";
import RefundAdjustModal from "../modals/RefundAdjustModal";
import { useMemo, useState } from "react";
import {
    InfoCircleOutlined,
    SearchOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import ExportToExcel from "../common/ExportExcel";

const TransactionsTable = ({
    transactions = [],
    loading = false,
    isAdmin = false,
    refresh,
}) => {
    const { Text, Title } = Typography;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [user, setUser] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchUser, setSearchUser] = useState("");

    const statusColor = {
        pending: "orange",
        confirmed: "green",
        rejected: "red",
    };

    const typeColor = {
        deposit: "blue",
        refund: "green",
        adjustment: "red",
        match_payment: "gold",
    };

    const uniquePlayers = Array.from(
        new Map(
            transactions.map((t) => [
                t?.user?._id,
                {
                    text: `${t?.user?.name ?? ""} ${
                        t?.user?.lastname ?? ""
                    }`,
                    value: t?.user?._id,
                },
            ])
        ).values()
    );

    // --------------------------------------------------
    // SEARCH - ADMIN ONLY
    // --------------------------------------------------

    const filteredTransactions = useMemo(() => {
        const term = searchUser.trim().toLowerCase();

        if (!term) return transactions;

        return transactions.filter((transaction) => {
            const fullName = `
                ${transaction?.user?.name ?? ""}
                ${transaction?.user?.lastname ?? ""}
            `
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            return fullName.includes(term);
        });
    }, [transactions, searchUser]);

    // --------------------------------------------------
    // REFUND / ADJUST - ADMIN ONLY
    // --------------------------------------------------

    const handleRefundAdjust = (transaction) => {
        if (!isAdmin) return;

        setUser(transaction?.user);
        setOpenModal(true);
    };

    // --------------------------------------------------
    // DESKTOP COLUMNS
    // --------------------------------------------------

    const desktopColumns = [
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) =>
                dayjs(date).format("DD/MM/YYYY HH:mm"),
            defaultSortOrder: "descend",
            sorter: (a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt),
        },

        {
            title: "User",
            key: "user",
            width: 150,
            hidden: !isAdmin,
            render: (transaction) => (
                <Text
                    type="secondary"
                    ellipsis
                >
                    {transaction?.user?.name}{" "}
                    {transaction?.user?.lastname}
                </Text>
            ),
            filterSearch: true,
            filters: uniquePlayers,
            onFilter: (value, record) =>
                record?.user?._id === value,
        },

        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={typeColor[type]}>
                    {type?.replace("_", " ").toUpperCase()}
                </Tag>
            ),
            filters: [
                {
                    text: "Deposit",
                    value: "deposit",
                },
                {
                    text: "Refund",
                    value: "refund",
                },
                {
                    text: "Adjustment",
                    value: "adjustment",
                },
                {
                    text: "Match Payment",
                    value: "match_payment",
                },
            ],
            onFilter: (val, record) =>
                record.type === val,
        },

        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: (amount) => (
                <Text strong>
                    €{Number(amount ?? 0).toFixed(2)}
                </Text>
            ),
            sorter: (a, b) =>
                a.amount - b.amount,
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={statusColor[status]}>
                    {status}
                </Tag>
            ),
            filters: [
                {
                    text: "Confirmed",
                    value: "confirmed",
                },
                {
                    text: "Pending",
                    value: "pending",
                },
                {
                    text: "Rejected",
                    value: "rejected",
                },
            ],
            onFilter: (val, record) =>
                record.status === val,
        },

        {
            title: "Method",
            dataIndex: "method",
            key: "method",
            render: (method) => method || "-",
        },

        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            render: (note) =>
                note || (
                    <Text type="secondary">
                        -
                    </Text>
                ),
        },

        {
            title: "Action",
            key: "action",
            hidden: !isAdmin,
            align: "center",
            render: (transaction) => (
                <Button
                    size="small"
                    type="primary"
                    onClick={() =>
                        handleRefundAdjust(transaction)
                    }
                >
                    Refund / Adjust
                </Button>
            ),
        },
    ];


    const exportData = useMemo(() => {
    return filteredTransactions.map((t) => ({
        Date: dayjs(t.createdAt).format("DD/MM/YYYY HH:mm"),
        ...(isAdmin && {
            Usuario: `${t?.user?.name ?? ""} ${t?.user?.lastname ?? ""}`.trim(),
        }),
        Type: t?.type?.replace("_", " ").toUpperCase(),
        Amount: Number(t?.amount ?? 0),
        Status: t?.status,
        Method: t?.method || "-",
        Note: t?.note || "-",
    }));
}, [filteredTransactions, isAdmin]);

    // --------------------------------------------------
    // MOBILE TRANSACTION CARD
    // --------------------------------------------------

    const MobileTransaction = ({ transaction }) => {
        const amount = Number(
            transaction?.amount ?? 0
        );

        return (
            <Card
                size="small"
                style={{
                    width: "100%",
                    marginBottom: 10,
                }}
                styles={{
                    body: {
                        padding: 14,
                    },
                }}
            >
                <Flex
                    vertical
                    gap={12}
                >
                    {/* TOP */}

                    <Flex
                        justify="space-between"
                        align="flex-start"
                        gap={12}
                    >
                        <Flex
                            vertical
                            gap={4}
                            style={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            {isAdmin && (
                                <Text
                                    strong
                                    ellipsis
                                >
                                    {
                                        transaction
                                            ?.user
                                            ?.name
                                    }{" "}
                                    {
                                        transaction
                                            ?.user
                                            ?.lastname
                                    }
                                </Text>
                            )}

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12,
                                }}
                            >
                                {dayjs(
                                    transaction?.createdAt
                                ).format(
                                    "DD/MM/YYYY · HH:mm"
                                )}
                            </Text>
                        </Flex>

                        <Text
                            strong
                            style={{
                                fontSize: 17,
                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            €
                            {amount.toFixed(2)}
                        </Text>
                    </Flex>

                    {/* TYPE / STATUS */}

                    <Flex
                        gap={6}
                        wrap="wrap"
                    >
                        <Tag
                            color={
                                typeColor[
                                    transaction?.type
                                ]
                            }
                        >
                            {transaction?.type
                                ?.replace(
                                    "_",
                                    " "
                                )
                                .toUpperCase()}
                        </Tag>

                        <Tag
                            color={
                                statusColor[
                                    transaction?.status
                                ]
                            }
                        >
                            {transaction?.status}
                        </Tag>
                    </Flex>

                    {/* METHOD */}

                    <Flex
                        justify="space-between"
                        align="center"
                        gap={12}
                    >
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                            }}
                        >
                            Method
                        </Text>

                        <Text
                            style={{
                                textAlign: "right",
                            }}
                        >
                            {transaction?.method ||
                                "-"}
                        </Text>
                    </Flex>

                    {/* NOTE */}

                    {transaction?.note && (
                        <Flex
                            vertical
                            gap={3}
                        >
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                Note
                            </Text>

                            <Text
                                style={{
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {transaction.note}
                            </Text>
                        </Flex>
                    )}

                    {/* ADMIN ACTION */}

                    {isAdmin && (
                        <Button
                            block
                            size="small"
                            type="primary"
                            onClick={() =>
                                handleRefundAdjust(
                                    transaction
                                )
                            }
                        >
                            Refund / Adjust
                        </Button>
                    )}
                </Flex>
            </Card>
        );
    };

    // --------------------------------------------------
    // MOBILE CONTENT
    // --------------------------------------------------

    const mobileContent = (
        <Flex
            vertical
            style={{
                width: "100%",
            }}
        >
            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        minHeight: 220,
                    }}
                >
                    <Spin size="large" />
                </Flex>
            ) : filteredTransactions.length ===
              0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No transactions found"
                    style={{
                        padding: "32px 0",
                    }}
                />
            ) : (
                filteredTransactions.map(
                    (transaction) => (
                        <MobileTransaction
                            key={transaction._id}
                            transaction={transaction}
                        />
                    )
                )
            )}
        </Flex>
    );

    // --------------------------------------------------
    // HEADER
    // --------------------------------------------------

    return (
        <>
            <Flex
                vertical
                gap={12}
                style={{
                    width: "100%",
                    marginBottom: 14,
                }}
            >
                {/* TITLE */}

                <Flex
                    justify="space-between"
                    align="center"
                    gap={8}
                >
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                        }}
                    >
                        Transactions{" "}
                        {!loading &&
                            `: ${filteredTransactions.length}`}
                    </Title>

                    <Flex
                        align="center"
                        gap={6}
                    >
                        {isAdmin && (
                            <Tooltip
                                title="Refund or adjust transactions"
                            >
                                <InfoCircleOutlined
                                    style={{
                                        cursor:
                                            "pointer",
                                        opacity: 0.7,
                                    }}
                                />
                            </Tooltip>
                        )}

                        {typeof refresh ===
                            "function" && (
                            <Tooltip title="Refresh transactions">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={
                                        <ReloadOutlined />
                                    }
                                    loading={
                                        loading
                                    }
                                    onClick={
                                        refresh
                                    }
                                    aria-label="Refresh transactions"
                                />
                            </Tooltip>
                        )}
                    </Flex>
                </Flex>

                {/* ADMIN SEARCH */}

                {isAdmin && (
                    <Input
                        allowClear
                        prefix={
                            <SearchOutlined />
                        }
                        placeholder="Search user"
                        value={searchUser}
                        onChange={(e) =>
                            setSearchUser(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            maxWidth: screens.sm
                                ? 320
                                : undefined,
                        }}
                    />
                )}

                {/* EXPORT */}

                <Flex
                    justify={
                        screens.xs
                            ? "stretch"
                            : "flex-start"
                    }
                >
                    <ExportToExcel
                        fileName="transactions.xlsx"
                        data={
                            exportData
                        }
                    />
                </Flex>
            </Flex>

            {/* CONTENT */}

            {screens.xs ? (
                mobileContent
            ) : (
                <Table
                    rowKey="_id"
                    columns={desktopColumns}
                    dataSource={
                        filteredTransactions
                    }
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                    }}
                    loading={loading}
                    scroll={{
                        x: 1000,
                    }}
                    tableLayout="auto"
                />
            )}

            {/* MODAL */}

            <RefundAdjustModal
                user={user}
                open={openModal}
                setOpen={setOpenModal}
                refresh={refresh}
            />
        </>
    );
};

export default TransactionsTable;