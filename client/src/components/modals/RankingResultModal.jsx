// [NUEVO ARCHIVO] src/components/Ranking/RankingResultModal.jsx
// Modal para que el JUGADOR envíe el resultado de su partido de ranking.
// Lo abre RankingMyMatch (botón "Report result").
//
// El jugador escribe el marcador como "yo - rival"; aquí se traduce a A/B
// (los lados del partido en BD) con `match.mySide` antes de enviarlo.
//
// Seguridad: la validación de aquí es SOLO comodidad (avisa antes de enviar).
// Las reglas que mandan están en el servidor (rankingValidator + controller):
// participante, partido publicado y 'scheduled', temporada activa, marcador
// válido y súper tie break obligatorio con 1-1.
import { useMemo, useState } from "react";
import { Alert, Checkbox, Divider, Flex, InputNumber, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { submitRankingResult } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";

const { Text } = Typography;

// Mismas reglas que server/validator/rankingValidator.js (Reglamento)
const isValidSetScore = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high === 6) return low <= 4;
    if (high === 7) return low === 5 || low === 6;
    return false;
};

const isValidSuperTieBreak = (a, b) => {
    const high = Math.max(a, b);
    const low = Math.min(a, b);
    if (high < 10) return false;
    if (high === 10) return low <= 8;
    return high - low === 2;
};

const isInt = (v) => Number.isInteger(v);

// El backend responde { message } en los controllers, pero validateFields
// responde un ARRAY de express-validator (422) → se contemplan los dos formatos.
const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const EMPTY_SCORE = { s1Me: null, s1Opp: null, s2Me: null, s2Opp: null, stbMe: null, stbOpp: null };

const ScoreRow = ({ label, me, opp, onMe, onOpp, max, disabled }) => (
    <Flex align="center" justify="space-between" gap={12}>
        <Text strong style={{ color: BRAND.navy, minWidth: 110 }}>{label}</Text>
        <Flex align="center" gap={8}>
            <InputNumber min={0} max={max} precision={0} value={me} onChange={onMe} disabled={disabled} style={{ width: 64 }} inputMode="numeric" />
            <Text type="secondary">-</Text>
            <InputNumber min={0} max={max} precision={0} value={opp} onChange={onOpp} disabled={disabled} style={{ width: 64 }} inputMode="numeric" />
        </Flex>
    </Flex>
);

const RankingResultModal = ({ open, match, onClose, onSubmitted }) => {
    const [score, setScore] = useState(EMPTY_SCORE);
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (value) => setScore((prev) => ({ ...prev, [key]: value }));

    const opponentName = match?.opponent
        ? [match.opponent.name, match.opponent.lastname].filter(Boolean).join(" ")
        : "Your opponent";

    // Estado derivado del marcador: errores, si hace falta STB y quién gana
    const { error, needsStb, iWin, complete } = useMemo(() => {
        const { s1Me, s1Opp, s2Me, s2Opp, stbMe, stbOpp } = score;
        const setsFilled = [s1Me, s1Opp, s2Me, s2Opp].every(isInt);
        if (!setsFilled) return { error: null, needsStb: false, iWin: null, complete: false };

        if (!isValidSetScore(s1Me, s1Opp)) return { error: `Set 1: ${s1Me}-${s1Opp} is not a valid set score (valid: 6-0 to 6-4, 7-5 or 7-6)`, needsStb: false, iWin: null, complete: false };
        if (!isValidSetScore(s2Me, s2Opp)) return { error: `Set 2: ${s2Me}-${s2Opp} is not a valid set score (valid: 6-0 to 6-4, 7-5 or 7-6)`, needsStb: false, iWin: null, complete: false };

        const setsWonByMe = (s1Me > s1Opp ? 1 : 0) + (s2Me > s2Opp ? 1 : 0);
        if (setsWonByMe !== 1) return { error: null, needsStb: false, iWin: setsWonByMe === 2, complete: true };

        // 1-1 → súper tie break obligatorio
        if (!isInt(stbMe) || !isInt(stbOpp)) return { error: null, needsStb: true, iWin: null, complete: false };
        if (!isValidSuperTieBreak(stbMe, stbOpp)) return { error: "Super tie break: first to 10, win by 2", needsStb: true, iWin: null, complete: false };
        return { error: null, needsStb: true, iWin: stbMe > stbOpp, complete: true };
    }, [score]);

    const resetAndClose = () => {
        if (submitting) return;
        setScore(EMPTY_SCORE);
        setConfirmed(false);
        onClose?.();
    };

    const handleSubmit = async () => {
        if (!match || !complete || !confirmed) return;

        // "yo/rival" → lados A/B del partido en BD
        const meIsA = match.mySide === "A";
        const toAB = (me, opp) => (meIsA ? { gamesA: me, gamesB: opp } : { gamesA: opp, gamesB: me });

        const payload = {
            matchId: match._id,
            sets: [toAB(score.s1Me, score.s1Opp), toAB(score.s2Me, score.s2Opp)],
            superTieBreak: needsStb
                ? {
                    played: true,
                    pointsA: meIsA ? score.stbMe : score.stbOpp,
                    pointsB: meIsA ? score.stbOpp : score.stbMe,
                }
                : { played: false, pointsA: null, pointsB: null },
        };

        setSubmitting(true);
        try {
            const data = await submitRankingResult(payload);
            toast.success(data?.message || "Result recorded");
            setScore(EMPTY_SCORE);
            setConfirmed(false);
            onSubmitted?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not submit the result. Please try again."));
            // 409 = el rival ya lo envió / partido cerrado → recargar para ver el estado real
            if (err?.response?.status === 409) onSubmitted?.();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={`Report result · Round ${match?.round ?? ""}`}
            onCancel={resetAndClose}
            onOk={handleSubmit}
            okText="Submit result"
            okButtonProps={{ disabled: !complete || !!error || !confirmed, loading: submitting }}
            cancelButtonProps={{ disabled: submitting }}
            closable={!submitting}
            mask={{ closable: !submitting }}
            destroyOnHidden
        >
            <Flex vertical gap={12}>
                <Flex justify="flex-end" gap={8} style={{ paddingRight: 4 }}>
                    <Text type="secondary" style={{ width: 64, textAlign: "center", fontSize: 12 }}>You</Text>
                    <Text type="secondary" style={{ width: 8 }} />
                    <Text type="secondary" ellipsis style={{ width: 64, textAlign: "center", fontSize: 12 }}>{opponentName}</Text>
                </Flex>

                <ScoreRow label="Set 1" me={score.s1Me} opp={score.s1Opp} onMe={set("s1Me")} onOpp={set("s1Opp")} max={7} disabled={submitting} />
                <ScoreRow label="Set 2" me={score.s2Me} opp={score.s2Opp} onMe={set("s2Me")} onOpp={set("s2Opp")} max={7} disabled={submitting} />

                {needsStb && (
                    <ScoreRow label="Super tie break" me={score.stbMe} opp={score.stbOpp} onMe={set("stbMe")} onOpp={set("stbOpp")} max={99} disabled={submitting} />
                )}

                {error && <Alert type="error" showIcon title={error} />}

                {complete && !error && (
                    <Alert
                        type={iWin ? "success" : "info"}
                        showIcon
                        title={iWin ? "You won this match" : `${opponentName} won this match`}
                    />
                )}

                <Divider style={{ margin: "4px 0" }} />

                <Alert
                    type="warning"
                    showIcon
                    title="Only one player needs to report the result and it cannot be changed afterwards. Incorrect or fraudulent results may result in suspension."
                />

                <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={submitting}>
                    I confirm this is the correct result
                </Checkbox>
            </Flex>
        </Modal>
    );
};

export default RankingResultModal;