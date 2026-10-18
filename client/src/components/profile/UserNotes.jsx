import { Button, Input, Typography, Space, Select } from 'antd'
import { useEffect, useState } from 'react';
import { addSuspension, addUserNote, getUserNoteHistory } from '../../actions/admin';
import { toast } from 'react-toastify';
import UserNoteTableModal from '../modals/UserNoteTableModal';
import { getSanctionCategory, SANCTION_CATEGORIES, SUSPENSION_DAYS_OPTIONS } from '../../helpers/sanctions';

const UserNotes = ({ userId, isSuspended, onSuspended }) => {

    const { TextArea } = Input;
    const { Title, Text } = Typography;

    const [note, setNote] = useState("");
    const [kind, setKind] = useState('note');
    const [category, setCategory] = useState(null);
    const [days, setDays] = useState(null);
    const [submitting, setSubmitting] = useState(false)
    //const [shouldSuspend, setShouldSuspend] = useState(false)
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


    // const handleSubmit2 = async (userId) => {
    //     try {
    //         const res = await addUserNote(userId, note)

    //         if (shouldSuspend) {
    //             addSuspension(userId, note)
    //         }

    //         const updated = await getUserNoteHistory(userId);
    //         setNoteHistory(updated);

    //         toast.success(res.message)
    //     } catch ({ response }) {
    //         console.log(response)
    //         toast.error(response?.data?.message || 'Error submitting note')
    //     } finally {
    //         setNote("")
    //         if (shouldSuspend) {
    //             setShouldSuspend(true)
    //         }
    //         //setShouldSuspend(true)
    //     }
    // }

    const selectedCategory = getSanctionCategory(category);
    const previousCount = category ? (noteHistory?.notesHistory || []).filter(
        n => n.category === category && n.kind !== 'note'
    ).length : 0

    const handleKindChange = (value) => {
        setKind(value);
        if (value === 'note') setCategory(null);
        if (value !== 'suspension') setDays(null)
    }

    const handleSubmit = async() => {
        if(!note.trim()) return toast.error("Please add a note")
        if(kind !== 'note' && !category) return toast.error("Please select a reason")
        if(kind === 'suspension' && !days) return toast.error("Please select days for suspension")

        setSubmitting(true);
        

        try {
            let res;

            if(kind === 'suspension'){
                res = await addSuspension(userId, note, days, category)
                onSuspended?.(res.suspendUntil)
            }else{
                res = await addUserNote(userId, note, kind, category)
            }

            const updated = await getUserNoteHistory(userId);

            setNoteHistory(updated);

            toast.success(res.message)

            setNote("");
            setKind("note")
            setCategory(null)
            setDays(null)
        } catch ({response}) {
            console.log(response)
            toast.error()
        }finally{
            setSubmitting(false)
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
            <Button
                type='primary'
                onClick={handleSubmit}
                loading={submitting}
                style={{ marginRight: 2 }}
            >
                Submit
            </Button>
            <Button type='default' onClick={handleOpenModal}>View notes</Button>


            {/* Antes era un checkbox ahora con nuevo policy cambia */}
            {/* <Checkbox
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
                            (User will be suspended for 15 days)
                        </Typography.Text>
                    </>
                )}
            </Checkbox> */}
            <Space wrap style={{ marginLeft: 10, marginTop: 5 }}>
                <Select
                    value={kind}
                    onChange={handleKindChange}
                    style={{ width: 170 }}
                    options={[
                        { value: 'note', label: 'Note only' },
                        { value: 'warning', label: 'Warning' },
                        {
                            value: 'suspension',
                            label: isSuspended ? 'Suspension (already suspended)' : 'Suspend',
                            disabled: isSuspended
                        }
                    ]}
                />

                {kind !== 'note' && (
                    <Select 
                        placeholder="Reason"
                        value={category}
                        onChange={setCategory}
                        style={{width: 280}}
                        options={SANCTION_CATEGORIES.map(c => ({value: c.value, label: c.label}))}
                    />
                )}

                {
                    kind === 'suspension' && (
                        <Select 
                            placeholder="Length (days)"
                            value={days}
                            onChange={setDays}
                            style={{width: 120}}
                            options={SUSPENSION_DAYS_OPTIONS.map(d => ({
                                value: d,
                                label: `${d} days`
                            }))}
                        />
                    )
                }

            </Space>

            {kind !== 'note' && selectedCategory && (
                <Text type='secondary' style={{display: 'block', fontSize: 12, marginTop: 6}}>
                    Guideline: {selectedCategory.policy} - Previous warnings/suspensions for this reason: {previousCount}
                </Text>
            )}

            {kind === 'suspension' && (
                <Text type='warning' style={{display: 'block', fontSize: 12, marginTop: 4}}>
                    This note will be visible to the player while the suspension is active.
                </Text>
            )}

            <UserNoteTableModal open={modalOpen} userNotes={noteHistory} setOpen={setModalOpen} />


        </>
    )
}

export default UserNotes