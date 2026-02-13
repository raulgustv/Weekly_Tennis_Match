import { Form, Modal } from 'antd'
import NTRPLevel from '../utils/NTRPLevel';
import { useEffect } from 'react';
import { adminUpdateNTRP } from '../../actions/admin';
import { toast } from 'react-toastify';


const NTRPModal = ({ player, openModal, onClose, fetchPlayers }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        if (player) {
            form.setFieldsValue({
                ntrplvl: player?.ntrplvl ?? 2.0
            })
        }
    }, [player, form])

    const handleNTRPLvl = async ({ ntrplvl }) => {

        try {
            const res = await adminUpdateNTRP(player?._id, ntrplvl)

            toast.success(`NTRP Level successfully adjusted from ${res?.oldLevel} to ${res?.newLevel}`)

            fetchPlayers()
            //Modal.destroyAll()
            onClose()
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }

        
    }



    return (
        <>
            <Modal
                title={`Adjust NTRP level for ${player?.name} ${player?.lastname}`}
                open={openModal}
                onCancel={onClose}
                destroyOnHidden
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleNTRPLvl}
                // initialValues={{
                //     ntrplvl: player?.ntrplvl ?? 2.0
                // }}
                >

                    <NTRPLevel />
                </Form>

            </Modal>
        </>
    )
}

export default NTRPModal