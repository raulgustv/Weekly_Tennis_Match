import { Flex, Form, Image, Popover, Slider, Typography} from "antd"



const NTRPLevel = () => {

    const sliderMarks = {
        1.0: "1.0",
        1.5: "1.5",
        2.0: "2.0",
        2.5: "2.5",
        3.0: "3.0",
        3.5: "3.5",
        4.0: "4.0",
        4.5: "4.5",
        5.0: "5.0",
    }

    const {Link} = Typography

    return (
        <>
            <Form.Item
                name="ntrplvl"
                label="NTRP Level"
                initialValue={2.0}
                rules={[
                    { type: 'number', required: true, min: 1, max: 5 },
                    { required: true, message: 'Please add a valid NTRP level' }
                ]}
            >

                <Slider
                    min={1}
                    max={5}
                    step={0.5}
                    marks={sliderMarks}
                />

            </Form.Item>
            <div style={{ marginTop: 4 }}>
                <Flex align="center" justify="space-between">
                    <a href="https://courtmatch.ca/quiz/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                        Take a self assesment quiz 
                    </a>
                    
                    <Popover
                        placement="right"
                        trigger="hover"
                        content={
                            <Image src={'https://res.cloudinary.com/rgustv-personal/image/upload/v1784460255/Public%20images/qvgzgrzwhbhplnwoqn4k.jpg'} width={400} preview={false} />                            
                        }
                    >
                        <Link>Hover to see NTRP Chart</Link>
                    </Popover>

                    
                </Flex>

            </div>

        </>
    )
}

export default NTRPLevel
