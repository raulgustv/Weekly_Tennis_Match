import { Flex, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";


const LoadingSpinner = ({ size="small", color="#46AF50" }) => {

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
                color: color
            }}
            spin
        />
    );
    return (
        <>
            <Flex align='center' gap="middle">
                <Spin indicator={antIcon} size='small' />
            </Flex>
        </>
    )
}

export default LoadingSpinner


