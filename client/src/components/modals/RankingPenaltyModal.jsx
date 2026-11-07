// NUEVO ARCHIVO: client/src/components/modals/RankingPenaltyModal.jsx
// Modal del admin para dar 1 penalty point a un jugador. Incluye la guía de motivos.
// `player` = fila de la clasificación (row.player, row.penaltyPoints, row.status).
// key={row._id} desde el padre → al abrir otro jugador el estado se reinicia solo.
import { useState } from "react";
import { Alert, Collapse, Flex, Input, Modal, Select, Tag, Typography } from "antd";
import { toast } from "react-toastify";
import { issuePenalty } from "../../actions/ranking";
import {
    NOTE_MAX,
    PENALTY_CATEGORIES,
    PENALTY_SCALE,
    SERIOUS_CONDUCT_NOTE,
    getNextSanctionText,
} from "../../helpers/rankingSantions.js";

const { Text } = Typography;

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const fullName = (p) => [p?.name, p?.lastname].filter(Boolean).join(" ") || "Unknown player";


const RankingPenaltyModal = ({ open, player, onClose, onSaved }) => {

    console.log(player)

    const [category, setCategory] = useState(null);
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    const name = fullName(player?.player);
    const currentPoints = player?.penaltyPoints ?? 0;
    const selected = PENALTY_CATEGORIES.find((c) => c.value === category);
    const nextSanction = getNextSanctionText(currentPoints);
    const noteOk = note.trim().length > 0 && note.trim().length <= NOTE_MAX;
    const canSave = !!category && noteOk && !!player?.player?._id;

    const handleSave = async () => {
        if (!canSave) return;

        setSaving(true);
        try {
            const data = await issuePenalty({
                userId: player.player._id,
                category,
                note: note.trim(),
            });

            toast.success(data?.message || "Penalty point issued");

            // Sanción automática provocada por este punto
            const sanction = data?.sanction;
            if (sanction?.action === "suspended") {
                toast.warning(`${name} is now suspended until round ${sanction.suspendedUntilRound}`);
            } else if (sanction?.action === "removed") {
                toast.warning(`${name} has been removed from the ranking for this season`);
            }
            if (data?.suspensionCheckFailed) {
                toast.warning("The point was issued, but the automatic suspension could not be checked. It will be applied the next time a point is issued or a round closes.");
            }

            onSaved?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not issue the penalty point. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`Issue penalty point · ${name}`}
            onCancel={() => !saving && onClose?.()}
            onOk={handleSave}
            okText="Issue penalty point"
            okButtonProps={{ disabled: !canSave, loading: saving, danger: true }}
            cancelButtonProps={{ disabled: saving }}
            closable={!saving}
            mask={{ closable: !saving }}
            destroyOnHidden
        >
            <Flex vertical gap={12}>
                <Flex align="center" gap={8}>
                    <Text type="secondary">Current penalty points:</Text>
                    <Tag color={currentPoints >= 3 ? "red" : currentPoints > 0 ? "orange" : "default"} style={{ marginInlineEnd: 0 }}>
                        {currentPoints}
                    </Tag>
                </Flex>

                {nextSanction && <Alert type="warning" showIcon title={nextSanction} />}

                <Flex vertical gap={4}>
                    <Text strong>Reason (required)</Text>
                    <Select
                        value={category}
                        onChange={setCategory}
                        placeholder="Select the reason"
                        options={PENALTY_CATEGORIES.map(({ value, label }) => ({ value, label }))}
                        disabled={saving}
                    />
                </Flex>

                {selected && <Alert type="info" showIcon title={selected.description} />}

                <Flex vertical gap={4}>
                    <Text strong>Note (required)</Text>
                    <Input.TextArea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={NOTE_MAX}
                        showCount
                        autoSize={{ minRows: 2, maxRows: 5 }}
                        placeholder="e.g. Did not show up to the round 3 match and did not warn the opponent"
                        disabled={saving}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Internal note. It is not shown to the player.
                    </Text>
                </Flex>

                <Collapse
                    size="small"
                    items={[
                        {
                            key: "guide",
                            label: "Guide: penalty points and sanctions",
                            children: (
                                <Flex vertical gap={8}>
                                    <Text>Each record adds exactly 1 point. Points can be issued for:</Text>
                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {PENALTY_CATEGORIES.map((c) => (
                                            <li key={c.value} style={{ marginBottom: 4 }}>
                                                <Text strong>{c.label}</Text>: {c.description}
                                            </li>
                                        ))}
                                    </ul>
                                    <Text strong>Automatic sanctions</Text>
                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {PENALTY_SCALE.map((s) => (
                                            <li key={s.points}>{s.points} points: {s.text}</li>
                                        ))}
                                    </ul>
                                    <Text type="secondary">Suspended players lose their ranking position and come back in the last position.</Text>
                                    <Text type="secondary">{SERIOUS_CONDUCT_NOTE}</Text>
                                </Flex>
                            ),
                        },
                    ]}
                />

                {/* QUITAR cuando exista "revocar punto" en el backend */}
                <Alert
                    type="warning"
                    showIcon
                    title="A penalty point cannot be undone from the app yet. Please double-check before confirming."
                />
            </Flex>
        </Modal>
    );
};

export default RankingPenaltyModal;