import { Button, Input, Typography, } from 'antd'
import { useEffect, useState } from 'react';
import { addUserNote, getUserNoteHistory } from '../../actions/admin';
import { toast } from 'react-toastify';
import UserNoteTableModal from '../modals/UserNoteTableModal';

const UserNotes = ({ userId }) => {

    const { TextArea } = Input;
    const { Title } = Typography;

    const [note, setNote] = useState("");
    const [modalOpen, setModalOpen] = useState(false)
    const [noteHistory, setNoteHistory] = useState([])
    


    useEffect(() => {

        const fetchUserNotes = async () => {
            try {

                const res = await getUserNoteHistory(userId);

                setNoteHistory(res)

            } catch (error) {
                console.log(error)
            }
        }

        if(userId) fetchUserNotes()

    }, [userId])


    const handleSubmit = async (userId) => {
        try {
            const res = await addUserNote(userId, note)

            toast.success(res.message)


        } catch ({ response }) {
            console.log(response)
            toast.error(response?.data?.message || 'Error submitting note')
        } finally {
            setNote("")
        }
    }

    const handleOpenModal =() =>{
        setModalOpen(true)
    }

    return (
        <>
            <Title level={5}>User notes</Title>
            <TextArea
                maxLength={1000}
                showCount
                placeholder='Add a note'
                onChange={(e) => setNote(e.target.value)}
                style={{ marginBottom: 5 }}
                value={note}
            />
            <Button type='primary' onClick={() => handleSubmit(userId)} style={{ marginRight: 2 }}>Submit</Button>
            <Button type='default' onClick={handleOpenModal}>View notes</Button>

            <UserNoteTableModal open={modalOpen} userNotes={noteHistory} setOpen={setModalOpen} />


        </>
    )
}

export default UserNotes