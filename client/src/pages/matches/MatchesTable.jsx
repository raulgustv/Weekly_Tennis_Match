import {
    Button,
    DatePicker,
    Flex,
    Select,
    Statistic,
    Table,
    Tag,
    Tooltip,
    Typography,
    Grid,
} from "antd";
import { useMatches } from "../../context/MatchContext";
import dayjs from "dayjs";
import {
    generateMatch,
    removeMatchCourt,
    updateStatus,
    addMatchCourts,
} from "../../actions/matches";
import { toast } from "react-toastify";
import colors from "../../themes/colors";
import { adminRemovePlayer } from "../../actions/admin";
import { useMemo, useState } from "react";
import AddNewCourtsModal from "../../components/matches/AddNewCourtsModal";
import { surfaceColors } from "../../themes/surfaceColors";
import WhatsappMessage from "../../components/modals/WhatsappMessage";
import ExportToExcel from "../../components/common/ExportExcel";


const MatchesTable = () => {
    const { matches, fetchMatches, loadMatches } = useMatches();
    const { Timer } = Statistic;

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [openMessageModal, setOpenMessageModal] = useState(false)
    const [filterDate, setFilterDate] = useState(null);

    // Orden por defecto: más reciente primero. El sorter de la columna
    // "Date" en desktop sigue funcionando igual (permite alternar asc/desc),
    // esto solo define el orden inicial, necesario porque en mobile no
    // existe la columna "Date" de la que depende defaultSortOrder.
    const sortedMatches = useMemo(() => {
        return [...matches].sort(
            (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        );
    }, [matches]);

    // Filtro por fecha exacta (sin hora). Funciona igual en desktop y mobile,
    // ya que filtra el dataSource antes de llegar a la tabla.
    const displayedMatches = useMemo(() => {
        if (!filterDate) return sortedMatches;
        return sortedMatches.filter((m) => dayjs(m.date).isSame(filterDate, "day"));
    }, [sortedMatches, filterDate]);

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


    //export to excel
    const flattenMatchesForExcel = (matches) => {
    return matches.map((m) => ({
        Date: dayjs(m.date).format("DD/MM/YYYY"),
        StartTime: m.startTime,
        EndTime: m.endTime,
        Location: m?.location?.name || "",
        Address: m?.location?.address || "",
        Status: m.status,
        Courts: m.courts?.map((c) => `Court ${c.courtNumber}`).join(", "),
        Players: m.players
            ?.map((p) => `${p.user?.name} ${p.user?.lastname}`)
            .join(", "),
        PlayersCount: m.players?.length || 0,
        CreatedBy: m.createdBy
            ? `${m.createdBy.name} ${m.createdBy.lastname}`
            : "",
        Price: m.price,
    }));
};

    /* -------------------------------------------------- */
    /* DESKTOP COLUMNS (comportamiento original, sin cambios de lógica) */
    /* -------------------------------------------------- */

    const desktopColumns = [
        {
            title: "Date",
            key: "date",
            render: (m) => dayjs(m.date).format("DD/MM/YYYY"),
            sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
            defaultSortOrder: "descend",
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
            key: "time",
            render: (m) => `${m.startTime} - ${m.endTime}`,
        },
        {
            title: "Location",
            key: "location",
            render: (_, m) => m?.location?.name,
        },
        {
            title: "Status",
            key: "status",
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
            key: "courts",
            render: (_, r) => (
                <Flex gap="small" align="center" wrap>
                    {r.courts.map((cn) => (
                        <Tag
                            key={cn.courtNumber}
                            color={surfaceColors[cn?.surface]}
                            closable={r.status === "Open"}
                            onClose={() => handleRemoveCourt(r._id, cn.courtNumber)}
                        >
                            Court {cn.courtNumber}
                        </Tag>
                    ))}

                    {(r.status === "Open" || r.status === "Full") && (
                        <Tooltip title="Add courts">
                            <Tag
                                color="cyan"
                                style={{ cursor: "pointer", borderStyle: "dashed" }}
                                onClick={() => openAddCourts(r)}
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
            key: "players",
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
            key: "generateMatch",
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
        {
            title: "Generate whatsapp message",
            key: "generateMessage",
            render: (r) =>
                (r.status === "Open" || r.status === "Full") &&
                (
                    <Button
                        style={{ backgroundColor: colors.blue }}
                        onClick={() => {
                            setOpenMessageModal(true)
                            setSelectedMatch(r)
                        }}
                    >
                        Generate message
                    </Button>
                ),
        },
    ];

    /* -------------------------------------------------- */
    /* MOBILE COLUMNS: una sola columna "card" que agrupa todo   */
    /* Prioriza Generate match / Generate message arriba          */
    /* -------------------------------------------------- */

    const mobileColumns = [
        {
            title: "Match",
            key: "match-mobile",
            render: (r) => {
                const canGenerateMatch =
                    (r.status === "Open" || r.status === "Full") &&
                    r.players.length >= 4;

                const canGenerateMessage =
                    r.status === "Open" || r.status === "Full";

                return (
                    <Flex vertical gap={10} style={{ width: "100%" }}>
                        {/* Header: fecha + hora + status */}
                        <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                            <Flex vertical gap={0}>
                                <span style={{ fontWeight: 600 }}>
                                    {dayjs(r.date).format("DD/MM/YYYY")}
                                </span>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {r.startTime} - {r.endTime}
                                </Text>
                            </Flex>

                            {r.status === "Played" || r.status === "Closed" ? (
                                <Tag color={statusColors[r.status]}>{r.status}</Tag>
                            ) : (
                                <Select
                                    size="small"
                                    value={r.status}
                                    options={statusOptions}
                                    onChange={(status) => handleStatusChange(r._id, status)}
                                    style={{ minWidth: 100 }}
                                />
                            )}
                        </Flex>

                        {/* Location */}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            📍 {r?.location?.name}
                        </Text>

                        {/* Acciones cruciales: generate match / message */}
                        {(canGenerateMatch || canGenerateMessage) && (
                            <Flex gap={8} wrap="wrap">
                                {canGenerateMatch && (
                                    <Button
                                        block
                                        style={{ backgroundColor: colors.yellow }}
                                        onClick={() => handleGenerateMatch(r._id)}
                                    >
                                        Generate match
                                    </Button>
                                )}

                                {canGenerateMessage && (
                                    <Button
                                        block
                                        style={{ backgroundColor: colors.blue }}
                                        onClick={() => {
                                            setOpenMessageModal(true);
                                            setSelectedMatch(r);
                                        }}
                                    >
                                        Generate message
                                    </Button>
                                )}
                            </Flex>
                        )}

                        {/* Courts */}
                        <Flex vertical gap={4}>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                                Courts
                            </Text>
                            <Flex gap="small" align="center" wrap>
                                {r.courts.map((cn) => (
                                    <Tag
                                        key={cn.courtNumber}
                                        color={surfaceColors[cn?.surface]}
                                        closable={r.status === "Open"}
                                        onClose={() => handleRemoveCourt(r._id, cn.courtNumber)}
                                    >
                                        Court {cn.courtNumber}
                                    </Tag>
                                ))}

                                {(r.status === "Open" || r.status === "Full") && (
                                    <Tag
                                        color="cyan"
                                        style={{ cursor: "pointer", borderStyle: "dashed" }}
                                        onClick={() => openAddCourts(r)}
                                    >
                                        + Add Courts
                                    </Tag>
                                )}
                            </Flex>
                        </Flex>

                        {/* Players */}
                        <Flex vertical gap={4}>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                                Players ({r.players.length})
                            </Text>
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
                        </Flex>
                    </Flex>
                );
            },
        },
    ];

    const columns = screens.xs ? mobileColumns : desktopColumns;

    const { Title, Text } = Typography;

    return (
        <>
            <Title level={3}>All matches</Title>
            <Text type="secondary">View all matches and manage status</Text>

            <Flex gap={12} wrap="wrap" align="center" style={{ margin: "12px 0" }}>
                <DatePicker
                    placeholder="Filtrar por fecha"
                    allowClear
                    value={filterDate}
                    onChange={(date) => setFilterDate(date)}
                    format="DD/MM/YYYY"
                    style={{ width: "100%", maxWidth: 220 }}
                />

                <ExportToExcel fileName="matches.xlsx" data={flattenMatchesForExcel(displayedMatches)} />
            </Flex>

            <Table
                columns={columns}
                dataSource={displayedMatches}
                rowKey="_id"
                loading={loadMatches}
                scroll={screens.xs ? undefined : { x: "max-content" }}
                showHeader={!screens.xs}
                tableLayout={screens.xs ? "fixed" : "auto"}
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

            <WhatsappMessage
                open={openMessageModal}
                match={selectedMatch}
                setOpenMessage={setOpenMessageModal}
            />
        </>
    );
};

export default MatchesTable;