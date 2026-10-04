import { Card, Typography } from "antd"
import colors from "../../themes/colors"

const RankingHeader = ({isMobile}) => {

    const {Title, Text} = Typography

    return (
        <div>
            <Card style={{
                marginBottom: 16,
                background: `linear-gradient(90deg, ${colors.navy} 0%, ${colors.green} 100%)`,
            }}
                variant="borderless"
                styles={{ body: { padding: isMobile ? 16 : 24 } }}
            >
                <Title level={isMobile ? 4 : 3} style={{margin: 0, color: colors.white}}>
                    MTC Ranking
                </Title>
                <Text style={{color:colors.white}}>
                    Play a ranked match every two weeks 
                </Text>
            </Card>
        </div>
    )
}

export default RankingHeader