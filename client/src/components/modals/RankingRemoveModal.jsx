// NUEVO ARCHIVO: client/src/components/modals/RankingRemoveModal.jsx
// Modal del admin para expulsar a un jugador del ranking (permanente). Incluye la guía.
// `player` = fila de la clasificación { _id, player, penaltyPoints, status } o un jugador
// inscrito sin posición (status 'pending').
// key={player._id} desde el padre → al abrir otro jugador el estado se reinicia solo.
import { useState } from "react";
import { Alert, Checkbox, Flex, Input, Modal, Tag, Typography } from "antd";
import { toast } from "react-toastify";
import { removePlayerFromRanking } from "../../actions/ranking";
import {
    REMOVAL_EFFECTS,
    REMOVAL_WHEN_TO_USE,
    REMOVE_REASON_MAX,
    REMOVE_REASON_MIN,
} from "../../helpers/rankingSantions.js";

const { Text } = Typography;

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const fullName = (p) => [p?.name, p?.lastname].filter(Boolean).join(" ") || "Unknown player";

const RankingRemoveModal = ({ open, player, onClose, onSaved }) => {
    const [reason, setReason] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [saving, setSaving] = useState(false);

    const name = fullName(player?.player);
    const currentPoints = player?.penaltyPoints ?? 0;
    const hasPosition = player?.status && player.status !== "pending";
    const reasonLength = reason.trim().length;
    const reasonOk = reasonLength >= REMOVE_REASON_MIN && reasonLength <= REMOVE_REASON_MAX;
    const canSave = reasonOk && confirmed && !!player?.player?._id;

    const handleSave = async () => {
        if (!canSave) return;

        setSaving(true);
        try {
            const data = await removePlayerFromRanking(player.player._id, reason.trim());

            toast.success(data?.message || "Player removed from the ranking");

            if (data?.cancelledMatches > 0) {
                toast.info(`${data.cancelledMatches} published match(es) cancelled`);
            }
            if (data?.removedDraftMatches > 0) {
                toast.info(`${data.removedDraftMatches} match(es) removed from the proposed round. Their opponents now appear without a pair.`);
            }

            onSaved?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not remove the player. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`Remove from ranking · ${name}`}
            onCancel={() => !saving && onClose?.()}
            onOk={handleSave}
            okText="Remove from ranking"
            okButtonProps={{ disabled: !canSave, loading: saving, danger: true }}
            cancelButtonProps={{ disabled: saving }}
            closable={!saving}
            mask={{ closable: !saving }}
            destroyOnHidden
        >
            <Flex vertical gap={12}>
                {hasPosition && (
                    <Flex align="center" gap={8}>
                        <Text type="secondary">Current penalty points:</Text>
                        <Tag color={currentPoints >= 3 ? "red" : currentPoints > 0 ? "orange" : "default"} style={{ marginInlineEnd: 0 }}>
                            {currentPoints}
                        </Tag>
                    </Flex>
                )}

                <Alert
                    type="error"
                    showIcon
                    title="Removing a player from the ranking is permanent"
                    description={
                        <Flex vertical gap={8}>
                            <Text>{REMOVAL_WHEN_TO_USE}</Text>
                            <Text strong>What happens</Text>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {REMOVAL_EFFECTS.map((text) => (
                                    <li key={text} style={{ marginBottom: 2 }}>{text}</li>
                                ))}
                            </ul>
                        </Flex>
                    }
                />

                <Flex vertical gap={4}>
                    <Text strong>Reason (required, shown to the player)</Text>
                    <Input.TextArea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={REMOVE_REASON_MAX}
                        showCount
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        placeholder="e.g. Repeated verbal abuse towards other players after several warnings"
                        disabled={saving}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        The player will see: "You have been removed from the MTC Ranking and can no longer take part. Reason: ..."
                        Write it clearly, factually and respectfully (minimum {REMOVE_REASON_MIN} characters).
                    </Text>
                </Flex>

                {/* QUITAR "yet" cuando exista "readmitir jugador" en el backend */}
                <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={saving}>
                    I understand this is permanent and cannot be undone from the app yet.
                </Checkbox>
            </Flex>
        </Modal>
    );
};

export default RankingRemoveModal;