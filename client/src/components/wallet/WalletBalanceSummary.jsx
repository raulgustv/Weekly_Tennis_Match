import { useMemo } from 'react';
import { Card, Flex, Typography, Statistic, Divider, Grid } from 'antd';
import { WalletOutlined, SwapOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const WalletBalanceSummary = ({ transactions = [] }) => {
    const screens = useBreakpoint();

    const { total, count } = useMemo(() => {
        const total = transactions.reduce((sum, transaction) => {
            const amount = Number(transaction?.amount) || 0;
            return sum + amount;
        }, 0);

        return { total, count: transactions.length };
    }, [transactions]);

    return (
        <Card
            variant="borderless"
            style={{
                borderRadius: 14,
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                height: '100%',
            }}
            styles={{ body: { padding: '14px 20px', height: '100%' } }}
        >
            <Flex
                align="center"
                justify="center"
                gap={14}
                wrap="wrap"
                style={{ height: '100%', rowGap: 10 }}
            >
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        width: 38,
                        height: 38,
                        minWidth: 38,
                        borderRadius: 11,
                        background: '#e6f4ff',
                        color: '#1677ff',
                        fontSize: 18,
                    }}
                >
                    <WalletOutlined />
                </Flex>

                <Flex vertical align="center">
                    <Typography.Text type="secondary" style={{ fontSize: 12, marginBottom: 2 }}>
                        Wallet balance
                    </Typography.Text>
                    <Statistic value={total} precision={2} prefix="€" style={{ fontSize: 22, fontWeight: 600 }} />
                </Flex>

                {screens.sm && <Divider orientation="vertical" style={{ height: 32, margin: 0 }} />}

                <Flex align="center" gap={6}>
                    <Flex
                        align="center"
                        gap={4}
                        style={{ background: '#e6f4ff', color: '#1677ff', padding: '3px 8px', borderRadius: 7, fontSize: 11, fontWeight: 500 }}
                    >
                        <SwapOutlined />
                        {count}
                    </Flex>
                    <Typography.Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                        {count === 1 ? 'transaction' : 'transactions'}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Card>
    );
};

export default WalletBalanceSummary;