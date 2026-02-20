import { Empty } from 'antd'
import {FrownOutlined} from  "@ant-design/icons"


const EmptyVote = () => {
    return (
        <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
                <p>
                    There are no matches to vote currently <FrownOutlined />
                </p>
            }
        />
    )
}

export default EmptyVote