// [NUEVO ARCHIVO] src/components/ranking/RankingRoundHeader.jsx
// Cabecera de la página de rondas (admin): nombre y estado de la temporada,
// próximo cierre de ronda, selector de ronda y botones de acción
// (proponer / publicar / descartar / activar temporada).
// No llama a la API: solo pinta y avisa a la página con callbacks.
import { Alert, Button, Flex, Grid, Popconfirm, Select, Tag, Typography } from "antd";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { BRAND, TYPE_META, FALLBACK_TYPE_META } from "../../helpers/seasonConsants.js";
import { buildMadridMoment, fmtDateTime } from "../utils/Madridtime.js";


const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Estado REAL de la temporada en BD (no calculado por fechas como en RankingStatCard)
const SEASON_STATUS_META = {
    upcoming: { label: "Upcoming", color: "blue" },
    active: { label: "Active", color: "green" },
    closed: { label: "Closed", color: "default" },
};

const roundOptionLabel = (r) => {
    if (!r.published) return `Round ${r.round} · Proposal`;
    if (r.pendingResults > 0) return `Round ${r.round} · In progress (${r.pendingResults} pending)`;
    return `Round ${r.round} · Completed`;
};

const RankingRoundHeader = ({
    season,
    rounds = [],
    selectedRound = null,
    pendingRound = null,
    openRound = null,
    actionLoading = null, // 'propose' | 'publish' | 'discard' | 'activate' | null
    onBack,
    onSelectRound,
    onPropose,
    onPublish,
    onDiscard,
    onActivate,
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const meta = TYPE_META[season?.type] || FALLBACK_TYPE_META;
    const status = SEASON_STATUS_META[season?.status] || { label: "Unknown", color: "default" };
    const isActive = season?.status === "active";
    const busy = Boolean(actionLoading);

    const nextClose = buildMadridMoment(season?.nextRoundCloseDate, season?.roundCloseTime);

    return (
        <Flex vertical gap={16}>
            {/* ================= BANNER ================= */}
            <div style={{ background: BRAND.gradient, borderRadius: 18, padding: isMobile ? 16 : "24px 28px", color: "#FFFFFF" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    style={{ color: "#FFFFFF", paddingInline: 0, marginBottom: 8 }}
                >
                    Back to seasons
                </Button>

                <Flex align="center" gap={10} wrap>
                    <Title level={isMobile ? 3 : 2} style={{ color: "#FFFFFF", margin: 0 }}>
                        {meta.emoji} {season?.name || "Season"}
                    </Title>
                    <Tag color={status.color} style={{ marginInlineEnd: 0 }}>
                        {status.label}
                    </Tag>
                </Flex>

                <Flex align="center" gap={8} style={{ marginTop: 6 }}>
                    <ClockCircleOutlined style={{ color: BRAND.gold }} />
                    <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                        {nextClose
                            ? `Next round closes: ${fmtDateTime(nextClose)} (Madrid time)`
                            : "No round close date set"}
                    </Text>
                </Flex>
            </div>

            {/* ================= TEMPORADA NO ACTIVA ================= */}
            {!isActive && (
                <Alert
                    type="info"
                    showIcon
                    title="This season is not active. Rounds can only be proposed and published for the active season."
                    action={
                        season?.status === "upcoming" && (
                            <Popconfirm
                                title="Activate this season?"
                                description="The season that is currently active (if any) will be closed. This cannot be undone from the app."
                                okText="Activate"
                                cancelText="Cancel"
                                onConfirm={onActivate}
                            >
                                <Button size="small" type="primary" icon={<ThunderboltOutlined />} loading={actionLoading === "activate"} disabled={busy}>
                                    Activate season
                                </Button>
                            </Popconfirm>
                        )
                    }
                />
            )}

            {/* ================= SELECTOR + ACCIONES ================= */}
            <Flex justify="space-between" align={isMobile ? "stretch" : "center"} gap={12} vertical={isMobile}>
                <Select
                    size="large"
                    style={{ minWidth: isMobile ? "100%" : 320 }}
                    placeholder="No rounds yet"
                    value={selectedRound ?? undefined}
                    onChange={onSelectRound}
                    disabled={!rounds.length || busy}
                    options={rounds.map((r) => ({ value: r.round, label: roundOptionLabel(r) }))}
                />

                {isActive && (
                    <Flex gap={8} vertical={isMobile}>
                        {pendingRound ? (
                            <>
                                <Popconfirm
                                    title={`Discard the proposal for round ${pendingRound}?`}
                                    description="Its matches will be deleted so you can generate a new proposal."
                                    okText="Discard"
                                    okButtonProps={{ danger: true }}
                                    cancelText="Cancel"
                                    onConfirm={onDiscard}
                                >
                                    <Button size="large" danger icon={<DeleteOutlined />} loading={actionLoading === "discard"} disabled={busy} block={isMobile}>
                                        Discard proposal
                                    </Button>
                                </Popconfirm>

                                <Popconfirm
                                    title={`Publish round ${pendingRound}?`}
                                    description="Players will see their match and can start scheduling it. A published round cannot be discarded."
                                    okText="Publish"
                                    cancelText="Cancel"
                                    onConfirm={onPublish}
                                >
                                    <Button
                                        size="large"
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        loading={actionLoading === "publish"}
                                        disabled={busy}
                                        block={isMobile}
                                        style={{ background: BRAND.green, borderColor: BRAND.green }}
                                    >
                                        Publish round {pendingRound}
                                    </Button>
                                </Popconfirm>
                            </>
                        ) : openRound ? (
                            <Text type="secondary">
                                Round {openRound} is in progress. The next round is proposed automatically when it closes.
                            </Text>
                        ) : (
                            <Button
                                size="large"
                                type="primary"
                                icon={<PlayCircleOutlined />}
                                loading={actionLoading === "propose"}
                                disabled={busy}
                                onClick={onPropose}
                                block={isMobile}
                                style={{ background: BRAND.green, borderColor: BRAND.green }}
                            >
                                Propose next round
                            </Button>
                        )}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default RankingRoundHeader;