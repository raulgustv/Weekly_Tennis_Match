import { Card, Flex, Typography } from "antd"

const RankingStatCard = ({ label, value, icon, color, soft, selected, onClick }) => {


    return (
        <>
            <Card
                hoverable
                //onClick={}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                //onKeyDown={}
                style={{
                    borderRadius: 14,
                    border: selected ? `2px solid ${color}` : '1px solid #F0F0F0',
                    transition: 'all .2s ease'
                }}
                styles={{ body: { padding: 16 } }}
            >
                <Flex align="center" gap={12}>
                    <Flex
                        align="center"
                        justify="center"
                        style={{ width: 42, height: 42, borderRadius: 12, background: soft, color, fontSize: 20, flexShrink: 0 }}
                    >
                        {icon}
                    </Flex>
                    <Flex vertical style={{ minWidth: 0 }}>

                    </Flex>
                </Flex>
            </Card>
        </>
    )
}

export default RankingStatCard