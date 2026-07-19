import { Flex, Form, Image, Slider, Typography, Modal} from "antd"
import { useState } from "react"


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

    const [openChart, setopenChart] = useState(false)

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
 
                        <Link onClick={() => setopenChart(true)}>
                            Hover to see NTRP Chart
                        </Link>                   
                </Flex>
            </div>

            <Modal
                open={openChart}
                onCancel={() => setopenChart(false)}
                centered
                width="50%"
                footer={false}
            >
                <Image 
                    src="https://res.cloudinary.com/rgustv-personal/image/upload/v1784460255/Public%20images/qvgzgrzwhbhplnwoqn4k.jpg"
                    style={{
                        width:"100%",
                        height: "auto"
                    }}
                    preview={{
                        mask: "Click to enlarge"
                    }}
                />
            </Modal>

        </>
    )
}

export default NTRPLevel
