import {
    Card,
    Tag,
    Typography,
    Button
} from "antd";

import { HolderOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch, updateGeneratedMatch } from "../../actions/matches";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import { toast } from "react-toastify";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const { Title, Text } = Typography;

/* ================= PLAYER CARD ================= */

const PlayerCard = ({ player }) => (
    <div
        style={{
            padding: "6px 8px",
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            gap: 6
        }}
    >
        {/* LEFT SIDE: DRAG HANDLE + NAME */}
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flex: 1,
                minWidth: 0
            }}
        >
            <HolderOutlined
                style={{
                    fontSize: 14,
                    color: "#bfbfbf",
                    cursor: "grab",
                    touchAction: "none"
                }}
            />

            <Text ellipsis style={{ flex: 1 }}>
                {player.name}
            </Text>
        </div>

        <Tag color="geekblue" style={{ margin: 0 }}>
            {player.ntrplvl}
        </Tag>
    </div>
);

/* ================= SORTABLE ================= */

const SortablePlayer = ({ id, player }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: 6,
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        // Clave para Android: evita que el navegador capture el gesto
        // como scroll antes de que dnd-kit lo reconozca como drag.
        touchAction: "none"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <PlayerCard player={player} />
        </div>
    );
};

/* ================= MAIN COMPONENT ================= */

const EditMatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [generatedMatches, setGeneratedMatches] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 }
        }),
        // Sensor dedicado para touch (Android). El delay evita que
        // un scroll normal dispare el drag, sin afectar iOS/desktop
        // porque PointerSensor sigue manejando esos casos igual que antes.
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 5 }
        })
    );

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchMatch = async () => {
            setPageLoading(true);

            const data = await getMatch(id);

            const normalized = data.generatedMatches.map(m => ({
                ...m,
                players: [
                    m.teamA.player1,
                    m.teamA.player2,
                    m.teamB.player1,
                    m.teamB.player2
                ]
            }));

            setGeneratedMatches(normalized);
            setPageLoading(false);
        };

        fetchMatch();
    }, [id]);

    /* ================= SWAP LOGIC ================= */

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const [fromRound, fromMatch, fromIndex] =
            active.id.split("-").map(Number);

        const [toRound, toMatch, toIndex] =
            over.id.split("-").map(Number);

        if (fromRound !== toRound) return;

        setGeneratedMatches(prev => {
            const updated = structuredClone(prev);

            const temp = updated[fromMatch].players[fromIndex];

            updated[fromMatch].players[fromIndex] =
                updated[toMatch].players[toIndex];

            updated[toMatch].players[toIndex] = temp;

            return updated;
        });
    };

    if (pageLoading) return <LoadingSpinner />;

    /* ================= RENDER ================= */

    const rounds = [...new Set(
        generatedMatches.map(m => m.round)
    )];

    const handleSave = async () => {
        const payload = generatedMatches.map(match => ({
            round: match.round,
            court: match.court,
            teamA: {
                player1: match.players[0]?._id,
                player2: match.players[1]?._id
            },
            teamB: {
                player1: match.players[2]?._id,
                player2: match.players[3]?._id
            }
        }));

        try {
            const res = await updateGeneratedMatch(id, payload);
            toast.success(res?.message);
        } catch (error) {
            console.log({ error });
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20
                }}
            >
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Title level={3} style={{ margin: 0 }}>
                    Edit Matches
                </Title>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {rounds.map(round => {

                    const matchesOfRound =
                        generatedMatches
                            .map((m, index) => ({ ...m, matchIndex: index }))
                            .filter(m => m.round === round);

                    const ids = matchesOfRound.flatMap(m =>
                        m.players.map(
                            (_, i) => `${round}-${m.matchIndex}-${i}`
                        )
                    );

                    return (
                        <div key={round} style={{ marginBottom: 40 }}>
                            <Title level={4}>Round {round}</Title>

                            <SortableContext items={ids}>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(340px, 1fr))",
                                        gap: 16
                                    }}
                                >
                                    {matchesOfRound.map(m => {

                                        const avgA =
                                            (m.players[0].ntrplvl +
                                                m.players[1].ntrplvl) / 2;

                                        const avgB =
                                            (m.players[2].ntrplvl +
                                                m.players[3].ntrplvl) / 2;

                                        return (
                                            <Card
                                                key={m.matchIndex}
                                                size="small"
                                                style={{ borderRadius: 16 }}
                                                styles={{ body: { padding: 12 } }}
                                                title={
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "space-between"
                                                    }}>
                                                        <Text strong>
                                                            Court {m.court}
                                                        </Text>
                                                        <Tag color="purple">
                                                            Round {m.round}
                                                        </Tag>
                                                    </div>
                                                }
                                            >
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                            "1fr 60px 1fr",
                                                        gap: 8
                                                    }}
                                                >
                                                    {/* TEAM A */}
                                                    <div
                                                        style={{
                                                            background: "#e6f4ff",
                                                            padding: 8,
                                                            borderRadius: 12
                                                        }}
                                                    >
                                                        <Text strong style={{ color: "#0958d9" }}>
                                                            TEAM A
                                                        </Text>

                                                        {m.players
                                                            .slice(0, 2)
                                                            .map((player, i) => (
                                                                <SortablePlayer
                                                                    key={`${round}-${m.matchIndex}-${i}`}
                                                                    id={`${round}-${m.matchIndex}-${i}`}
                                                                    player={player}
                                                                />
                                                            ))}

                                                        <Tag
                                                            style={{
                                                                marginTop: 6,
                                                                width: "100%",
                                                                textAlign: "center",
                                                                background: "#1677ff",
                                                                color: "#fff",
                                                                border: "none"
                                                            }}
                                                        >
                                                            Avg {avgA.toFixed(2)}
                                                        </Tag>
                                                    </div>

                                                    {/* VS */}
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                            paddingTop: 25
                                                        }}
                                                    >
                                                        <Tag
                                                            color="volcano"
                                                            style={{ fontWeight: 700 }}
                                                        >
                                                            VS
                                                        </Tag>
                                                    </div>

                                                    {/* TEAM B */}
                                                    <div
                                                        style={{
                                                            background: "#fff1f0",
                                                            padding: 8,
                                                            borderRadius: 12
                                                        }}
                                                    >
                                                        <Text strong style={{ color: "#cf1322" }}>
                                                            TEAM B
                                                        </Text>

                                                        {m.players
                                                            .slice(2, 4)
                                                            .map((player, i) => (
                                                                <SortablePlayer
                                                                    key={`${round}-${m.matchIndex}-${i + 2}`}
                                                                    id={`${round}-${m.matchIndex}-${i + 2}`}
                                                                    player={player}
                                                                />
                                                            ))}

                                                        <Tag
                                                            style={{
                                                                marginTop: 6,
                                                                width: "100%",
                                                                textAlign: "center",
                                                                background: "#ff4d4f",
                                                                color: "#fff",
                                                                border: "none"
                                                            }}
                                                        >
                                                            Avg {avgB.toFixed(2)}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </div>
                    );
                })}
            </DndContext>

            <Button type="primary" style={{ marginTop: 20 }} onClick={handleSave}>
                Save Changes
            </Button>
        </>
    );
};

export default EditMatch;