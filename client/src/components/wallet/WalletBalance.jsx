import { Button, Card, Flex, Typography, Grid, Input, Select } from "antd"
import { PlusCircleOutlined } from '@ant-design/icons'
import { useState } from "react";
import { addFunds } from "../../actions/wallet";
import {toast} from 'react-toastify'


const WalletBalance = ({ balance, fetchTransactions, loading, setLoading }) => {

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [showForm, setShowForm] = useState(false)
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState('bizum');

    const { Text, Title } = Typography;

    const handleAddFunds = () => {
        setShowForm((prev) => !prev)
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)

            const payload = {
                amount: Number(amount),
                method
            }

           await addFunds(payload)            

            toast.success('Your request to send funds has been sent')

            fetchTransactions()
            setShowForm(false)

            
        } catch ({response}) {
            console.log(response)
            setLoading(false)
            toast.error(response?.data?.message)
            setShowForm(false)
        }finally{
            setLoading(false)
        }
    }

    return (
        <Card>
            <Flex
                vertical={!screens.md}
                justify="space-around"
                align={screens.md ? 'center' : 'flex-start'}
                gap={16}
            >
                <Flex vertical>
                    <Text type="secondary">Available balance</Text>

                    <Title level={5}>€{balance.toFixed(2)}</Title>
                </Flex>

                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    size="large"
                    block={!screens.md}
                    onClick={handleAddFunds}
                >
                    Add funds
                </Button>
                {showForm && (
                    <Flex
                        vertical={!screens.md}
                        gap={12}
                        style={{ marginTop: 16 }}
                    >
                        <Input
                            placeholder="Amount (€)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <Select
                            value={method}
                            onChange={setMethod}
                            options={[
                                { value: "bizum", label: 'Bizum' },
                                { value: "revolut", label: 'Revolut' },
                                { value: "paypal", label: 'Paypal' },
                            ]}
                        />

                        <Button onClick={handleSubmit} loading={loading} type="primary" >
                            Confirm
                        </Button>
                        <Button onClick={() => {setShowForm(false)}}>
                            Cancel
                        </Button>
                    </Flex>
                )}
            </Flex>


        </Card>
    )
}

export default WalletBalance