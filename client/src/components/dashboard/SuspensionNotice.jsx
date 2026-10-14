// 🆕 NUEVO ARCHIVO: client/src/components/dashboard/SuspensionNotice.jsx
// Aviso de suspensión para /games (UserDashboard).
//
// ⚠️ MEDIDA TEMPORAL (a rehacer este fin de semana):
// El motivo se saca de user.notesHistory, que hoy llega al frontend porque
// PUBLIC_USER_FIELDS (server/utils/userProjections.js) incluye "notesHistory".
// La solución definitiva es guardar user.suspensionReason en suspendUser y
// quitar notesHistory de PUBLIC_USER_FIELDS.
//
// Cómo se elige la nota:
// suspendUser hace suspendedUntil = ahora + days (7 por defecto, y el front
// nunca envía otro valor) y en ese mismo instante hace push de la nota.
// Por eso, el inicio de la suspensión es suspendedUntil - 7 días, y la nota
// correcta es la que se creó en ese momento (con un margen pequeño).
// Si no hay ninguna nota en ese margen, se muestra el aviso SIN motivo, en vez
// de enseñar una nota que no corresponde (p. ej. "User removed from match...").

import { Alert, Statistic, Typography } from "antd";
import { StopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Timer } = Statistic;
const { Text } = Typography;

// Debe coincidir con el `days = 7` por defecto de suspendUser en el servidor
const SUSPENSION_DAYS = 15;

// Margen para emparejar la fecha de la nota con el inicio de la suspensión
const MATCH_TOLERANCE_MS = 60 * 1000; // 1 minuto

const getSuspensionReason = (notesHistory, suspendedUntil) => {
    if (!Array.isArray(notesHistory) || !suspendedUntil) return null;

    const suspensionStart =
        new Date(suspendedUntil).getTime() -
        SUSPENSION_DAYS * 24 * 60 * 60 * 1000;

    // Se recorre al revés para quedarnos con la más reciente que coincida
    for (let i = notesHistory.length - 1; i >= 0; i--) {
        const n = notesHistory[i];
        if (!n?.at || typeof n?.note !== "string") continue;

        const diff = Math.abs(new Date(n.at).getTime() - suspensionStart);

        if (diff <= MATCH_TOLERANCE_MS && n.note.trim()) {
            return n.note.trim();
        }
    }

    return null;
};

const SuspensionNotice = ({ user }) => {
    const isSuspended =
        user?.suspendedUntil &&
        new Date(user.suspendedUntil) > new Date();

    if (!isSuspended) return null;

    const reason = getSuspensionReason(user?.notesHistory, user?.suspendedUntil);

    return (
        <Alert
            type="error"
            showIcon
            icon={<StopOutlined />}
            style={{ marginBottom: 20, borderRadius: 12 }}
            title="Your account is temporarily suspended"
            description={
                <div>
                    <Text style={{ display: "block" }}>
                        You cannot join matches until{" "}
                        <Text strong>
                            {dayjs(user.suspendedUntil).format("DD-MM-YYYY HH:mm")}
                        </Text>
                        .
                    </Text>

                    {/* El texto de la nota se pinta como texto plano (React lo escapa),
                        nunca con dangerouslySetInnerHTML */}
                    {reason && (
                        <Text style={{ display: "block", marginTop: 8 }}>
                            <Text strong>Reason:</Text> {reason}
                        </Text>
                    )}

                    <div style={{ marginTop: 12 }}>
                        <Timer
                            title="Suspension ends in"
                            type="countdown"
                            value={new Date(user.suspendedUntil).getTime()}
                            format="D [days] H [hours] m [minutes] s"
                            // Igual que ProfileHeader: al terminar, recarga para quitar el aviso
                            onFinish={() => window.location.reload()}
                        />
                    </div>

                    <Text
                        type="secondary"
                        style={{ display: "block", marginTop: 8, fontSize: 12 }}
                    >
                        If you think this is a mistake, please contact an administrator.
                    </Text>
                </div>
            }
        />
    );
};

export default SuspensionNotice;