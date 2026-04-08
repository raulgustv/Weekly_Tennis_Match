import { Table, Tag, Typography } from "antd"
import dayjs from "dayjs"

const TransactionsTable = ({ transactions, isMobile, loading, isAdmin}) => {

    //console.log(transactions)

    const { Text, Title } = Typography;

    const statusColor = {
        pending: "orange",
        confirmed: "green",
        rejected: "red",
    };

    const typeColor = {
        deposit: "blue",
        refund: "green",
        adjustment: "lime",
        match_payment: 'gold'
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
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
            filters: transactions.map((p) => ({
                text: `${p?.user?.name} ${p?.user?.lastname}`,
                value: `${p?.user?.name} ${p?.user?.lastname}`
            })),
            onFilter: (value, record) => {
                const fullName = `${record?.user?.name} ${record?.user?.lastname}`.toLowerCase();
                return fullName.startsWith(value.toLowerCase());
            },
            align: 'center'
        }



    ]


    return (
        <Table
            rowKey="_id"
            columns={columns}
            dataSource={transactions}
            pagination={{ pageSize: 6 }}
            loading={loading}
            title={
                () => (
                    <Title level={4}>Transactions: {transactions?.length}</Title>
                )
            }
            scroll={{ x: 1000 }}
        />
    )
}

export default TransactionsTable