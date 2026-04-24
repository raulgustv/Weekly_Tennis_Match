import { Modal, Table } from 'antd'
import dayjs from 'dayjs'


const UserNoteTableModal = ({ open, userNotes, setOpen }) => {

    const {notesHistory} = userNotes;

    

    //console.log(notesHistory)

    const columns = [
        {
            title: 'Date',
            dataIndex: 'at',
            key: 'at',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            defaultSortOrder: 'descend',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note'
        },
        {
            title: 'Posted by',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (r) => (
                <p>{r?.name} {r?.lastname}</p>
            )
        }
    ]

    return (
        <Modal
            open={open}
            destroyOnHidden
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            closable
            cancelButtonProps={{ style: { display: 'none' } }}
            okText="Close"
        >
            <Table
                dataSource={notesHistory}
                columns={columns}
                rowKey="_id"
            />
        </Modal>
    )
}

export default UserNoteTableModal