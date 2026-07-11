import { Table, Tag, Typography, Tooltip } from "antd"
import dayjs from "dayjs"
import RefundAdjustModal from "../modals/RefundAdjustModal";
import { useState } from "react";
import{InfoCircleOutlined} from '@ant-design/icons'
import ExportToExcel from "../common/ExportExcel";

const TransactionsTable = ({ transactions, isMobile, loading, isAdmin, refresh }) => {

    //console.log(transactions)

    const { Text, Title } = Typography;

    const [user, setUser] = useState(null);
    const [openModal, setOpenModal] = useState(false)

    //const {fetchAllTransactions} = useAllTransactions()

    const statusColor = {
        pending: "orange",
        confirmed: "green",
        rejected: "red",
    };

    const typeColor = {
        deposit: "blue",
        refund: "green",
        adjustment: "red",
        match_payment: 'gold'
    };

    const uniquePlayers = Array.from(
        new Map(
            transactions.map((t) => [
                t?.user?._id,
                {
                    text: `${t?.user?.name} ${t?.user?.lastname}`,
                    value: t?.user?._id
                }
            ])
        ).values()
    );

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            defaultSortOrder: 'descend',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: "type",
            render: (type) => (
                <Tag color={typeColor[type]}>
                    {type.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Deposit', value: 'deposit' },
                { text: 'Refund', value: 'refund' },
                { text: 'Adjustment', value: 'adjustment' },
            ],
            onFilter: (val, record) => record.type === val
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: "method",
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: "amount",
            align: 'right',
            render: (amt, r) => (
                <Text strong>
                    €{amt.toFixed(2)}
                </Text>
            ),
            sorter: (a, b) => a.amt - b.amt
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: "status",
            render: (s) => (
                <Tag color={statusColor[s]}>
                    {s}
                </Tag>
            ),
            filters: [
                { text: 'Confirmed', value: 'confirmed' },
                { text: 'Pending', value: 'pending' },
                { text: 'Rejected', value: 'rejected' },
            ],
            onFilter: (val, record) => record.status === val
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: "note",
            align: 'right',
            render: (note) => (note || <Text type="secondary">-</Text>)
        },
        {
            title: 'Player',
            key: 'user',
            width: 150,
            hidden: !isAdmin,
            render: ((p) => (
                <Text type="secondary">{p?.user?.name} {p?.user?.lastname}  </Text>
            )),
            filterSearch: true,
            filters: uniquePlayers,
            onFilter: (value, record) => record?.user?._id === value,
            align: 'center'
        }
    ]

    return (
        <>
        <ExportToExcel fileName="transactions.xlsx" data={transactions} />
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={transactions}
                pagination={{ pageSize: 6 }}
                loading={loading}
                title={() => (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Title level={4} style={{ margin: 0 }}>
                            Transactions: {transactions?.length}
                        </Title>

                        {isAdmin && (
                            <Tooltip title="Double click on a row to create a refund">
                                <InfoCircleOutlined style={{ cursor: "pointer", opacity: 0.7 }} />
                            </Tooltip>
                        )}
                    </div>
                )}
                scroll={{ x: 1000 }}
                onRow={({ user }) => ({
                    onDoubleClick: () => {
                        if (!isAdmin) return
                        setUser(user);
                        setOpenModal(true)
                    }
                })}
            />

            <RefundAdjustModal user={user} open={openModal} setOpen={setOpenModal} refresh={refresh}  />
        </>
    )
}

export default TransactionsTable