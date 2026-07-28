import { Button, Input, Typography, Checkbox } from 'antd'
import { useEffect, useState } from 'react';
import { addSuspension, addUserNote, getUserNoteHistory } from '../../actions/admin';
import { toast } from 'react-toastify';
import UserNoteTableModal from '../modals/UserNoteTableModal';

const UserNotes = ({ userId, isSuspended }) => {

    const { TextArea } = Input;
    const { Title } = Typography;

    const [note, setNote] = useState("");
    const [shouldSuspend, setShouldSuspend] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [noteHistory, setNoteHistory] = useState([])


    useEffect(() => {

        if (!userId) return;

        const fetchUserNotes = async () => {
            try {

                const res = await getUserNoteHistory(userId);

                setNoteHistory(res)

            } catch (error) {
                console.log(error)
            }
        }

        if (userId) fetchUserNotes()

    }, [userId])


    const handleSubmit = async (userId) => {
        try {
            const res = await addUserNote(userId, note)

            if (shouldSuspend) {
                addSuspension(userId, note)
            }

            const updated = await getUserNoteHistory(userId);
            setNoteHistory(updated);

            toast.success(res.message)
        } catch ({ response }) {
            console.log(response)
            toast.error(response?.data?.message || 'Error submitting note')
        } finally {
            setNote("")
            if (shouldSuspend) {
                setShouldSuspend(true)
            }
            //setShouldSuspend(true)
        }
    }

    const handleOpenModal = () => {
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
            <Checkbox
                style={{ marginLeft: 10 }}
                disabled={isSuspended}
                checked={isSuspended || shouldSuspend}
                onChange={(e) => setShouldSuspend(e.target.checked)}
            >
                {isSuspended ? (
                    "User suspended"
                ) : (
                    <>
                        Suspend user{" "}
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            (User will be suspended for 7 days)
                        </Typography.Text>
                    </>
                )}
            </Checkbox>

            <UserNoteTableModal open={modalOpen} userNotes={noteHistory} setOpen={setModalOpen} />


        </>
    )
}

export default UserNotes