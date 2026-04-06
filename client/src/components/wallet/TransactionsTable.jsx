import { Table, Tag, Typography } from "antd"
import dayjs from "dayjs"

const TransactionsTable = ({ transactions, isMobile, loading, title}) => {

    //console.log(transactions)
    
    const {Text, Title} = Typography;

    const statusColor = {
        pending: "orange",
        confirmed: "green",
        rejected: "red",
    };

    const typeColor = {
        deposit: "blue",
        refund: "green",
        adjustment: "lime",
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a,b) => new Date(a.createdAt) - new Date(b.createdAt)
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
                {text: 'Deposit', value: 'deposit'},
                {text: 'Refund', value: 'refund'},
                {text: 'Adjustment', value: 'adjustment'},
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
            sorter: (a,b) => a.amt - b.amt
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
                {text: 'Confirmed', value: 'confirmed'},
                {text: 'Pending', value: 'pending'},
                {text: 'Rejected', value: 'rejected'},
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
        
    ]
    

    return (
        <Table 
            rowKey="_id"
            columns={columns}
            dataSource={transactions}
            pagination={{pageSize: 6}}
            loading={loading}
            title={
                () => (
                    <Title level={4}>Transactions: {transactions?.length}</Title>
                )
            }
        />
    )
}

export default TransactionsTable