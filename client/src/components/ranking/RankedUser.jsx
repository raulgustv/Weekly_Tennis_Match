import { Alert, Button, Card, Col, Descriptions, Modal, Row, Tag, Typography } from "antd"
import dayjs from "dayjs"
import RankingRulesSummary from "./RankingSummary";
import { useState } from "react";
import { rankingRetire } from "../../actions/ranking";
import { toast } from "react-toastify";


const RankedUser = ({ user, isMobile, loadUser }) => {

    const DATE_FORMAT = "DD/MM/YYYY";

    const [retireOpen, setRetireOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRetire = async()=>{
        try {
            
            setRetireOpen(true);
            setLoading(true)

            const res = await rankingRetire();

            toast.success(res?.data?.message || 'You have retired from the ranking')
            loadUser()
            
        } catch (error) {
            setRetireOpen(false)
            setLoading(false)
            console.log(error)
            toast.error('Error retiring from ranking please contact your administrator')
        }finally{
            setRetireOpen(false)
            setLoading(false)
        }
    }

    //console.log(user)

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
                <Card
                    title="Your registration"
                    extra={<Tag color="green">Registered</Tag>}
                >
                    <Descriptions
                        column={1}
                        size="small"
                        items={[
                            {
                                key: 'since',
                                label: 'Registered on',
                                children: user?.rankingRegisteredAt ? dayjs(user?.rankingRegisteredAt).format(DATE_FORMAT) : '-'
                            },
                            {
                                key: "rules",
                                label: "Rules accepted",
                                children: user.rankingRulesAcceptedAt
                                    ? `${dayjs(user.rankingRulesAcceptedAt).format(DATE_FORMAT)}${user.rankingRulesVersion
                                        ? ` (${user.rankingRulesVersion})` : ""}`
                                    : "-",
                            }
                        ]}
                    />
                    <Alert
                        style={{ marginTop: 16 }}
                        type="info"
                        showIcon
                        title="What happens next?"
                        description="You will be included in the next round when it is generated. Rounds close every other Sunday at 21:00 (Madrid time) and your opponent will be announced when the new round is published."
                    />
                </Card>
            </Col>

            <Col xs={24} lg={10}>
                <Card title="Leave ranking">
                        <Typography.Paragraph>
                            If you retire you will lose your ranking possition. If you join back you will start in last possition
                        </Typography.Paragraph>
                        <Button
                            danger
                            block={isMobile}
                            onClick={() => setRetireOpen(true)}
                            disabled={loading}
                        >
                            Retire from ranking
                        </Button>
                </Card>
            </Col>

            <Col xs={24}>
                <Card title="Ranking rules">
                    <RankingRulesSummary />
                </Card>
            </Col>

            <Modal
                open={retireOpen}
                title="Retire from ranking"
                onCancel={() => setRetireOpen(false)}
                onOk={handleRetire}
                okText="Yes, retire"
                destroyOnHidden
                closable={!loading}
                mask={{closable: !loading}}
                okButtonProps={{danger: true, loading: loading}}
                cancelButtonProps={{disabled: loading}}
            >
                <Typography.Paragraph>
                    You will lose your current ranking position and will not be included in future rounds
                </Typography.Paragraph>
                <Alert
                    type="warning"
                    showIcon
                    title="If you have a future match scheduled please let your oponent know"
                />
            </Modal>
        </Row>
    )
}

export default RankedUser