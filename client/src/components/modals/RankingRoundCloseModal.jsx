// [NUEVO ARCHIVO] src/components/Ranking/RankingRoundCloseModal.jsx
// Modal del ADMIN para cambiar la fecha/hora de cierre de la ronda en juego
// (extenderla por lluvia, festivos, etc., o adelantarla).
// Lo abre RankingRoundHeader (botón "Change") a través de RankingRounds.
//
// Se envía solo el DÍA (YYYY-MM-DD) y la hora (HH:mm), siempre hora de Madrid;
// el servidor construye el momento real igual que el cron. Las comprobaciones
// de aquí son solo comodidad: el servidor exige admin, temporada activa, cierre
// al menos 30 min en el futuro y como mucho 90 días.
import { useMemo, useState } from "react";
import { Alert, DatePicker, Flex, Modal, TimePicker, Typography } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { updateRoundCloseDate } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";
import { buildMadridMoment, fmtDateTime, MADRID_TZ } from "../utils/Madridtime.js";

const { Text } = Typography;
const MAX_DAYS_AHEAD = 90; // igual que el servidor

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

// Día (YYYY-MM-DD) del cierre actual EN MADRID, para precargar el DatePicker
const madridDayOf = (date) => {
    if (!date) return null;
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: MADRID_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
    return parts; // en-CA → "YYYY-MM-DD"
};

// key={season._id + nextRoundCloseDate} desde el padre → el estado se reinicia al reabrir
const RankingRoundCloseModal = ({ open, season, onClose, onSaved }) => {
    const currentClose = buildMadridMoment(season?.nextRoundCloseDate, season?.roundCloseTime);
    const currentDay = madridDayOf(currentClose);

    const [day, setDay] = useState(currentDay ? dayjs(currentDay, "YYYY-MM-DD") : null);
    const [time, setTime] = useState(dayjs(season?.roundCloseTime || "21:00", "HH:mm"));
    const [saving, setSaving] = useState(false);

    // Momento resultante (Madrid) para la vista previa y las comprobaciones
    const newClose = useMemo(() => {
        if (!day || !time) return null;
        // buildMadridMoment usa la parte UTC de la fecha → se le pasa el día a 00:00 UTC
        return buildMadridMoment(`${day.format("YYYY-MM-DD")}T00:00:00.000Z`, time.format("HH:mm"));
    }, [day, time]);

    const now = Date.now();
    const tooSoon = newClose && newClose.getTime() < now + 30 * 60 * 1000;
    const tooFar = newClose && newClose.getTime() > now + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000;
    const unchanged = newClose && currentClose && newClose.getTime() === currentClose.getTime();
    const diffDays = newClose && currentClose ? Math.round((newClose - currentClose) / 86400000) : null;
    const canSave = newClose && !tooSoon && !tooFar && !unchanged;

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        try {
            const data = await updateRoundCloseDate(season._id, {
                nextRoundCloseDate: day.format("YYYY-MM-DD"),
                roundCloseTime: time.format("HH:mm"),
            });
            toast.success(data?.message || "Round close date updated");
            onSaved?.();
        } catch (err) {
            toast.error(getErrorMessage(err, "Could not change the round close date. Please try again."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Change round close date"
            onCancel={() => !saving && onClose?.()}
            onOk={handleSave}
            okText="Save new date"
            okButtonProps={{ disabled: !canSave, loading: saving, style: canSave ? { background: BRAND.green } : undefined }}
            cancelButtonProps={{ disabled: saving }}
            closable={!saving}
            mask={{ closable: !saving }}
            destroyOnHidden
        >
            <Flex vertical gap={14}>
                <Text type="secondary">
                    Current close: <Text strong>{currentClose ? `${fmtDateTime(currentClose)} (Madrid time)` : "not set"}</Text>
                </Text>

                <Flex gap={12} wrap>
                    <Flex vertical gap={4} style={{ flex: 1, minWidth: 180 }}>
                        <Text strong>New close day</Text>
                        <DatePicker
                            value={day}
                            onChange={setDay}
                            format="ddd DD MMM YYYY"
                            allowClear={false}
                            disabled={saving}
                            disabledDate={(d) => d && (d.isBefore(dayjs().startOf("day")) || d.isAfter(dayjs().add(MAX_DAYS_AHEAD, "day")))}
                            style={{ width: "100%" }}
                        />
                    </Flex>
                    <Flex vertical gap={4} style={{ width: 130 }}>
                        <Text strong>Time (Madrid)</Text>
                        <TimePicker
                            value={time}
                            onChange={setTime}
                            format="HH:mm"
                            minuteStep={5}
                            allowClear={false}
                            needConfirm={false}
                            disabled={saving}
                            style={{ width: "100%" }}
                        />
                    </Flex>
                </Flex>

                {newClose && !tooSoon && !tooFar && !unchanged && (
                    <Alert
                        type="success"
                        showIcon
                        title={`The round will close on ${fmtDateTime(newClose)} (Madrid time)`}
                        description={diffDays ? `${diffDays > 0 ? "Extended by" : "Brought forward by"} ${Math.abs(diffDays)} day(s).` : undefined}
                    />
                )}
                {tooSoon && <Alert type="error" showIcon title="The new close date must be at least 30 minutes in the future." />}
                {tooFar && <Alert type="error" showIcon title={`The new close date cannot be more than ${MAX_DAYS_AHEAD} days away.`} />}

                <Alert
                    type="info"
                    showIcon
                    title={`Players see the new date right away and reminders adjust automatically. The following rounds keep the ${season?.roundIntervalDays || 14}-day rhythm counting from this new date.`}
                />
            </Flex>
        </Modal>
    );
};

export default RankingRoundCloseModal;