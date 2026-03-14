import { Flex, Modal, Select, Tag } from 'antd'
import { useState } from 'react'


const CourtModalSurface = ({ open, onClose, court, updateSurface, }) => {

    const [surface, setSurface] = useState(null)
    const [courtToUpdate, setCourtToUpdate] = useState(null);

    const surfaces = ['Quick', 'Hard', 'Clay', 'Grass'];

    const colors = {
        Quick: 'blue',
        Hard: 'geekblue',
        Clay: 'volcano',
        Grass: 'green',
    }

    const handleChange = (cn, val) => {
        setSurface(val)
        setCourtToUpdate(cn)
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={
                () => {
                    if (!surface || !courtToUpdate) return;
                    updateSurface(court?.slug, surface, courtToUpdate)
                }
            }
            title={court?.name}

        >
            {court?.courts?.map((cn) => (
                <div key={cn?.number}>
                    <Flex
                        key={cn?.number}
                        justify='flex-start'
                        align='center'
                        gap={12}
                    >
                        <Tag color={colors[surface && courtToUpdate === cn?.number ? surface : cn?.surface]}>
                            Court: {cn?.number}
                        </Tag>

                        <Select
                            //key={cn?.number}
                            value={surface && courtToUpdate === cn.number ? surface : cn.surface}
                            style={{ width: '50%', marginBottom: 10 }}
                            options={surfaces.map((s) => ({
                                value: s,
                                label: s
                            }))}
                            onChange={(val) => handleChange(cn?.number, val)}
                        />


                    </Flex>

                </div>
            ))}
        </Modal>
    )
}

export default CourtModalSurface