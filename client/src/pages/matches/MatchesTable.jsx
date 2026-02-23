import {
    Button,
    Flex,
    Select,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useMatches } from "../../context/MatchContext";
import dayjs from "dayjs";
import {
    generateMatch,
    removeMatchCourt,
    updateStatus,
    addMatchCourts, // ← cuando conectes backend
} from "../../actions/matches";
import { toast } from "react-toastify";
import colors from "../../themes/colors";
import { adminRemovePlayer } from "../../actions/admin";
import { useState } from "react";
import AddNewCourtsModal from "../../components/matches/AddNewCourtsModal";

const MatchesTable = () => {
    const { matches, fetchMatches, loadMatches } = useMatches();
    const { Timer } = Statistic;

    console.log(matches)


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const statusOptions = [
        { value: "Open", label: "Open" },
        { value: "Full", label: "Full" },
        { value: "Closed", label: "Closed" },
        { value: "Cancelled", label: "Cancelled" },
    ];

    const statusColors = {
        Open: "lime",
        Full: "green",
        Closed: "volcano",
        Played: "geekblue",
        Cancelled: "magenta",
    };

    const handleStatusChange = async (id, status) => {
        try {
            const res = await updateStatus(id, status);
            toast.success(`Match status updated: ${res?.status}`);
            fetchMatches();
        } catch (error) {
            toast.error("Error updating match");
        }
    };

    const handleGenerateMatch = async (id) => {
        try {
            await generateMatch(id);
            toast.success("Match successfully generated");
            fetchMatches()
        } catch (error) {
            toast.error("Error generating match");
        }
    };

    const handleRemovePlayer = async (matchId, playerId) => {
        try {
            await adminRemovePlayer(matchId, playerId);
            toast.success("Player removed from match");
            fetchMatches();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const handleRemoveCourt = async (matchId, courtNumber) => {
        try {
            const { removedCourt } = await removeMatchCourt(matchId, courtNumber);
            toast.success(`Court #${removedCourt} removed`);
            fetchMatches();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    /* -------------------------------------------------- */
    /* ADD COURTS FLOW                                    */
    /* -------------------------------------------------- */


    const openAddCourts = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const handleAddCourts = async (courts) => {
        try {

            const {message} = await addMatchCourts(courts, selectedMatch?._id)

            toast.success(message)
            
            setIsModalOpen(false);
            setSelectedMatch(null);
            fetchMatches();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    /* -------------------------------------------------- */
    /* TABLE COLUMNS                                      */
    /* -------------------------------------------------- */

    const columns = [
        {
            title: "Date",
            key: "date",
            render: (m) => dayjs(m.date).format("DD/MM/YYYY"),
            sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
            defaultSortOrder: "ascend",
        },
        {
            title: "Days until match",
            key: "daysToMatch",
            render: (m) => {
                if (!m?.date || !m?.startTime || m.status === "Cancelled") return "N/A";

                const [h, min] = m.startTime.split(":");
                const target = dayjs(m.date)
                    .hour(Number(h))
                    .minute(Number(min));

                if (!target.isValid() || target.valueOf() <= Date.now()) return "N/A";

                return (
                    <Timer
                        type="countdown"
                        value={target.valueOf()}
                        format="D [days] H [hours] m [min] s [sec]"
                    />
                );
            },
        },
        {
            title: "Time",
            render: (m) => `${m.startTime} - ${m.endTime}`,
        },
        {
            title: "Location",
            render: (_, m) => m?.location?.name,
        },
        {
            title: "Status",
            render: (m) =>
                m.status === "Played" || m.status === "Closed" ? (
                    <Tag color={statusColors[m.status]}>{m.status}</Tag>
                ) : (
                    <Select
                        size="small"
                        value={m.status}
                        options={statusOptions}
                        onChange={(status) => handleStatusChange(m._id, status)}
                    />
                ),
        },
        {
            title: "Courts",
            render: (_, r) => (
                <Flex gap="small" align="center" wrap>
                    {r.courtNumbers.map((cn) => (
                        <Tag
                            key={cn}
                            color="blue"
                            closable={r.status === "Open"}
                            onClose={() => handleRemoveCourt(r._id, cn)}
                        >
                            Court {cn}
                        </Tag>
                    ))}

                    {(r.status === "Open" || r.status === "Full") && (
                        <Tooltip title="Add courts">
                            <Tag
                                color="cyan"
                                style={{ cursor: "pointer", borderStyle: "dashed" }}
                                onClick={() => openAddCourts(r)} // ✅ AQUÍ
                            >
                                + Add Courts
                            </Tag>
                        </Tooltip>
                    )}
                </Flex>
            ),
        },
        {
            title: "Players",
            render: (_, r) => (
                <Flex gap="small" wrap>
                    {r.players.map((p) => (
                        <Tag
                            key={p._id}
                            color="green"
                            closable={r.status !== "Played" && r.status !== "Full"}
                            onClose={() => handleRemovePlayer(r._id, p.user._id)}
                        >
                            {p.user.name} {p.user.lastname} 
                        </Tag>
                    ))}
                </Flex>
            ),
        },
        {
            title: "Generate Match",
            render: (r) =>
                (r.status === "Open" || r.status === "Full") &&
                r.players.length >= 4 && (
                    <Button
                        style={{ backgroundColor: colors.yellow }}
                        onClick={() => handleGenerateMatch(r._id)}
                    >
                        Generate match
                    </Button>
                ),
        },
    ];

    const { Title, Text } = Typography;

    return (
        <>
            <Title level={3}>All matches</Title>
            <Text type="secondary">View all matches and manage status</Text>

            <Table
                columns={columns}
                dataSource={matches}
                rowKey="_id"
                loading={loadMatches}
                scroll={{x: "max-content"}}
            />

            {/* ✅ MODAL */}
            <AddNewCourtsModal
                openModal={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedMatch(null);
                }}
                match={selectedMatch}
                onConfirm={handleAddCourts}
            />
        </>
    );
};

export default MatchesTable;
