import {
    Button,
    Flex,
    Input,
    Table,
    Tag,
    Typography,
    Tooltip,
    Grid,
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
    transactions,
    isMobile,
    loading,
    isAdmin,
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
                    text: `${t?.user?.name} ${t?.user?.lastname}`,
                    value: t?.user?._id,
                },
            ])
        ).values()
    );

    // --------------------------------------------------
    // SEARCH BY USER
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
    // OPEN REFUND / ADJUST
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
            render: (p) => (
                <Text
                    type="secondary"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                    }}
                >
                    {p?.user?.name} {p?.user?.lastname}
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
                    {type.toUpperCase()}
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
            ],
            onFilter: (val, record) =>
                record.type === val,
        },

        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "right",
            render: (amt) => (
                <Text strong>
                    €{amt.toFixed(2)}
                </Text>
            ),
            sorter: (a, b) =>
                a.amount - b.amount,
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s) => (
                <Tag color={statusColor[s]}>
                    {s}
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
        },

        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            align: "right",
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
                        handleRefundAdjust(
                            transaction
                        )
                    }
                >
                    Refund / Adjust
                </Button>
            ),
        },
    ];

    // --------------------------------------------------
    // MOBILE COLUMNS
    // ONE COLUMN / CARD PER TRANSACTION
    // --------------------------------------------------

    const mobileColumns = [
        {
            title: "Transaction",
            key: "transaction-mobile",
            render: (transaction) => (
                <Flex
                    vertical
                    gap={10}
                    style={{
                        width: "100%",
                    }}
                >
                    {/* USER + AMOUNT */}

                    <Flex
                        justify="space-between"
                        align="center"
                        gap={8}
                    >
                        <Flex
                            vertical
                            gap={2}
                            style={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            {isAdmin && (
                                <Text
                                    strong
                                    style={{
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap",
                                    }}
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
                                    transaction.createdAt
                                ).format(
                                    "DD/MM/YYYY HH:mm"
                                )}
                            </Text>
                        </Flex>

                        <Text
                            strong
                            style={{
                                fontSize: 16,
                                whiteSpace: "nowrap",
                            }}
                        >
                            €
                            {transaction.amount.toFixed(
                                2
                            )}
                        </Text>
                    </Flex>

                    {/* TYPE + STATUS */}

                    <Flex
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        gap={8}
                    >
                        <Tag
                            color={
                                typeColor[
                                    transaction.type
                                ]
                            }
                        >
                            {transaction.type.toUpperCase()}
                        </Tag>

                        <Tag
                            color={
                                statusColor[
                                    transaction.status
                                ]
                            }
                        >
                            {transaction.status}
                        </Tag>
                    </Flex>

                    {/* METHOD */}

                    <Flex
                        justify="space-between"
                        align="center"
                        gap={8}
                    >
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 12,
                            }}
                        >
                            Method
                        </Text>

                        <Text>
                            {transaction.method ||
                                "-"}
                        </Text>
                    </Flex>

                    {/* NOTE */}

                    <Flex
                        vertical
                        gap={2}
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

                        <Text>
                            {transaction.note ||
                                "-"}
                        </Text>
                    </Flex>

                    {/* REFUND / ADJUST */}

                    {isAdmin && (
                        <Flex
                            justify="flex-end"
                            style={{
                                marginTop: 2,
                            }}
                        >
                            <Button
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
                        </Flex>
                    )}
                </Flex>
            ),
        },
    ];

    const columns = screens.xs
        ? mobileColumns
        : desktopColumns;

    return (
        <>
            {/* --------------------------------------------------
                HEADER
            -------------------------------------------------- */}

            <Flex
                vertical={screens.xs}
                gap={10}
                style={{
                    width: "100%",
                    marginBottom: 12,
                }}
            >
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
                        Transactions:{" "}
                        {filteredTransactions?.length}
                    </Title>

                    {isAdmin && (
                        <Tooltip title="Refund or adjust transactions">
                            <InfoCircleOutlined
                                style={{
                                    cursor: "pointer",
                                    opacity: 0.7,
                                }}
                            />
                        </Tooltip>
                    )}
                </Flex>

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
                            maxWidth: 320,
                        }}
                    />
                )}
            </Flex>

            {/* --------------------------------------------------
                EXPORT
            -------------------------------------------------- */}

            <div
                style={{
                    marginBottom: 12,
                }}
            >
                <ExportToExcel
                    fileName="transactions.xlsx"
                    data={filteredTransactions}
                />
            </div>

            {/* --------------------------------------------------
                TABLE HEADER
            -------------------------------------------------- */}

            <Flex
                justify="space-between"
                align="center"
                style={{
                    width: "100%",
                    marginBottom: 8,
                }}
            >
                <Text
                    type="secondary"
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                >
                    Transactions
                </Text>

                <Tooltip title="Refresh transactions">
                    <Button
                        type="text"
                        size="small"
                        icon={
                            <ReloadOutlined
                                spin={loading}
                            />
                        }
                        loading={loading}
                        onClick={refresh}
                        aria-label="Refresh transactions"
                    />
                </Tooltip>
            </Flex>

            {/* --------------------------------------------------
                TABLE
            -------------------------------------------------- */}

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={filteredTransactions}
                pagination={{
                    pageSize: 6,
                }}
                loading={loading}
                scroll={
                    screens.xs
                        ? undefined
                        : { x: 1000 }
                }
                showHeader={!screens.xs}
                tableLayout={
                    screens.xs
                        ? "fixed"
                        : "auto"
                }
            />

            {/* --------------------------------------------------
                REFUND / ADJUST MODAL
            -------------------------------------------------- */}

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