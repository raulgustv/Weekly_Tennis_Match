// [NUEVO ARCHIVO] src/components/Ranking/RankingAdminResultModal.jsx
// Modal del ADMIN para fijar o corregir el resultado de un partido de ranking
// (partidos 'disputed' tras el cierre, resultados mal reportados, etc.).
// Lo abre RankingRounds (botón "Set result" / "Edit result" de cada partido).
//
// Seguridad: aquí solo se avisa antes de enviar. El servidor comprueba que
// quien llama es admin, que el partido está publicado, no cancelado y es de la
// temporada activa, valida el marcador y exige el motivo (queda auditado en el
// partido). El servidor deshace el rating del resultado anterior antes de
// aplicar el nuevo, así un partido nunca cuenta dos veces.
import { useMemo, useState } from "react";
import { Alert, Flex, Input, InputNumber, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { adminSetRankingResult } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";
import { evaluateScore } from "../../helpers/RankingScoreRules.js";

const { Text } = Typography;
const REASON_MAX = 300;

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const fullName = (p) => (p ? [p.name, p.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user");

// Precarga el marcador actual del partido (si lo tiene) para corregirlo
const initialScore = (match) => {
    const s = match?.sets || [];
    const stb = match?.superTieBreak?.played ? match.superTieBreak : null;
    return {
        s1a: s[0]?.gamesA ?? null, s1b: s[0]?.gamesB ?? null,
        s2a: s[1]?.gamesA ?? null, s2b: s[1]?.gamesB ?? null,
        stba: stb?.pointsA ?? null, stbb: stb?.pointsB ?? null,
    };
};

const formatScore = (match) => {
    if (!match?.sets?.length) return null;
    const sets = match.sets.map((s) => `${s.gamesA}-${s.gamesB}`).join(" · ");
    return match.superTieBreak?.played ? `${sets} · [${match.superTieBreak.pointsA}-${match.superTieBreak.pointsB}]` : sets;
};

const ScoreRow = ({ label, a, b, onA, onB, max, disabled }) => (
    <Flex align="center" justify="space-between" gap={12}>
        <Text strong style={{ color: BRAND.navy, minWidth: 110 }}>{label}</Text>
        <Flex align="center" gap={8}>
            <InputNumber min={0} max={max} precision={0} value={a} onChange={onA} disabled={disabled} style={{ width: 64 }} inputMode="numeric" />
            <Text type="secondary">-</Text>
            <InputNumber min={0} max={max} precision={0} value={b} onChange={onB} disabled={disabled} style={{ width: 64 }} inputMode="numeric" />
        </Flex>
    </Flex>
);

// key={match._id} desde el padre → al abrir otro partido el estado se reinicia solo
const RankingAdminResultModal = ({ open, match, onClose, onSaved }) => {
    const [score, setScore] = useState(() => initialScore(match));
    const [reason, setReason] = useState("");
    const [saving, setSaving] = useState(false);

    const set = (key) => (value) => setScore((prev) => ({ ...prev, [key]: value }));
    const { error, needsStb, aWins, complete } = useMemo(() => evaluateScore(score), [score]);

    const nameA = fullName(match?.playerA);
    const nameB = fullName(match?.playerB);
    const previous = formatScore(match);
    const hadResult = ["played", "admin_resolved", "walkover"].includes(match?.status);
    const reasonOk = reason.trim().length > 0 && reason.trim().length <= REASON_MAX;

    const handleSave = async () => {
        if (!match || !complete || error || !reasonOk) return;

        const payload = {
            sets: [
                { gamesA: score.s1a, gamesB: score.s1b },
                { gamesA: score.s2a, gamesB: score.s2b },
            ],
            superTieBreak: needsStb
                ? { played: true, pointsA: score.stba, pointsB: score.stbb }
                : { played: false, pointsA: null, pointsB: null },
            reason: reason.trim(),
        };

        setSaving(true);
        try {
            const data = await adminSetRankingResult(match._id, payload);
            toast.success(data?.message || "Result saved");
            onSaved?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not save the result. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`${hadResult ? "Edit" : "Set"} result · Round ${match?.round ?? ""}`}
            onCancel={() => !saving && onClose?.()}
            onOk={handleSave}
            okText="Save result"
            okButtonProps={{ disabled: !complete || !!error || !reasonOk, loading: saving, danger: hadResult }}
            cancelButtonProps={{ disabled: saving }}
            closable={!saving}
            mask={{ closable: !saving }}
            destroyOnHidden
        >
            <Flex vertical gap={12}>
                {previous && (
                    <Text type="secondary">
                        Current result: <Text strong style={{ fontFamily: "monospace" }}>{previous}</Text>
                    </Text>
                )}
                {match?.status === "disputed" && (
                    <Alert type="warning" showIcon title="No result was reported before the round closed. Both players already received 1 penalty point (they are not removed here)." />
                )}

                <Flex justify="flex-end" gap={8} style={{ paddingRight: 4 }}>
                    <Text type="secondary" ellipsis style={{ width: 64, textAlign: "center", fontSize: 12 }} title={nameA}>{nameA}</Text>
                    <Text type="secondary" style={{ width: 8 }} />
                    <Text type="secondary" ellipsis style={{ width: 64, textAlign: "center", fontSize: 12 }} title={nameB}>{nameB}</Text>
                </Flex>

                <ScoreRow label="Set 1" a={score.s1a} b={score.s1b} onA={set("s1a")} onB={set("s1b")} max={7} disabled={saving} />
                <ScoreRow label="Set 2" a={score.s2a} b={score.s2b} onA={set("s2a")} onB={set("s2b")} max={7} disabled={saving} />
                {needsStb && (
                    <ScoreRow label="Super tie break" a={score.stba} b={score.stbb} onA={set("stba")} onB={set("stbb")} max={99} disabled={saving} />
                )}

                {error && <Alert type="error" showIcon title={error} />}
                {complete && !error && <Alert type="success" showIcon title={`Winner: ${aWins ? nameA : nameB}`} />}

                <Flex vertical gap={4}>
                    <Text strong>Reason (required)</Text>
                    <Input.TextArea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={REASON_MAX}
                        showCount
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        placeholder="e.g. Both players confirmed the score by WhatsApp"
                        disabled={saving}
                    />
                </Flex>

                <Alert
                    type="info"
                    showIcon
                    title={hadResult
                        ? "The rating change from the current result will be reversed and the new result applied. Positions are recalculated."
                        : "The match will be marked as resolved by the administration. Positions are recalculated."}
                />
            </Flex>
        </Modal>
    );
};

export default RankingAdminResultModal;