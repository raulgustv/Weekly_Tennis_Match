// [NUEVO ARCHIVO] src/components/Ranking/RankingMatchScoreboard.jsx
// Marcador de un partido de ranking YA JUGADO, visto desde el jugador:
//   - Banner de resultado animado: si gana, entrada con brillo dorado, trofeo y
//     confeti; si pierde, entrada suave y mensaje de ánimo (sin confeti).
//   - Marcador estilo TV: fila "You" y fila del rival, una columna por set y,
//     si hubo, la columna del súper tie break destacada en dorado.
// Solo pinta: no llama a la API. Lo usa RankingMyMatch (partido de la ronda actual).
//
// El confeti sale UNA vez por partido y navegador (localStorage, envuelto en
// try/catch: si el navegador lo bloquea, simplemente se vuelve a ver).
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { CrownFilled, RiseOutlined, TrophyFilled, UserOutlined } from "@ant-design/icons";
import ProfilePicture from "../uploads/ProfilePicture";
import { fmtShortDate } from "../utils/Madridtime.js";
import "../../styles/Rankingscoreboard.css";

const CELEBRATED_KEY_PREFIX = "mtc-ranking-celebrated-";

// Confeti determinista (sin Math.random en el render): posición, color, retraso, deriva y giro
const CONFETTI_COLORS = ["#F4D03F", "#1E7F43", "#FFFFFF", "#7FD3A0", "#F4D03F", "#CDEB3B"];
const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
    x: `${(i * 37) % 100}%`,
    c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    d: `${(i % 7) * 70}ms`,
    dx: `${((i % 5) - 2) * 14}px`,
    r: `${(i % 2 ? 1 : -1) * (180 + i * 25)}deg`,
}));

const fullName = (p) => (p ? [p.name, p.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user");

const readCelebrated = (matchId) => {
    try {
        return window.localStorage.getItem(CELEBRATED_KEY_PREFIX + matchId) === "1";
    } catch {
        return false;
    }
};

const writeCelebrated = (matchId) => {
    try {
        window.localStorage.setItem(CELEBRATED_KEY_PREFIX + matchId, "1");
    } catch {
        /* navegador sin storage: no pasa nada */
    }
};

// Sets y súper tie break traducidos a "yo / rival"
const toMySide = (match) => {
    const meIsA = match?.mySide === "A";
    const sets = (match?.sets || []).map((s) => ({
        me: meIsA ? s.gamesA : s.gamesB,
        opp: meIsA ? s.gamesB : s.gamesA,
    }));
    const stb = match?.superTieBreak?.played
        ? {
            me: meIsA ? match.superTieBreak.pointsA : match.superTieBreak.pointsB,
            opp: meIsA ? match.superTieBreak.pointsB : match.superTieBreak.pointsA,
        }
        : null;
    return { sets, stb };
};

const bannerText = (won, opponentName, hadStb) => {
    if (won) {
        return {
            title: "Victory!",
            sub: hadStb
                ? `You won the super tie break against ${opponentName}.`
                : `Straight-sets win against ${opponentName}.`,
        };
    }
    return {
        title: hadStb ? "So close!" : "Good fight!",
        sub: hadStb
            ? `${opponentName} took the super tie break. A new opponent awaits next round.`
            : `${opponentName} took this one. A new opponent awaits next round.`,
    };
};

const ScoreRow = ({ label, avatar, values, stbValue, isWinner, side, cols, rowIndex }) => (
    <div className={`mtc-sb-row${isWinner ? " mtc-sb-row--winner" : ""}`} style={{ "--cols": cols }}>
        <div className="mtc-sb-player">
            {avatar}
            <span className="mtc-sb-player-name">{label}</span>
            {isWinner && <CrownFilled style={{ color: "#F4D03F", fontSize: 14 }} />}
        </div>
        {values.map((v, i) => (
            <div
                key={i}
                className={`mtc-sb-cell${v[side] > v[side === "me" ? "opp" : "me"] ? " mtc-sb-cell--win" : ""}`}
                style={{ "--d": `${(i * 2 + rowIndex) * 90}ms` }}
            >
                {v[side]}
            </div>
        ))}
        {stbValue && (
            <div
                className={`mtc-sb-cell mtc-sb-stb${stbValue[side] > stbValue[side === "me" ? "opp" : "me"] ? " mtc-sb-cell--win" : ""}`}
                style={{ "--d": `${(values.length * 2 + rowIndex) * 90}ms` }}
            >
                {stbValue[side]}
            </div>
        )}
    </div>
);

const RankingMatchScoreboard = ({ match }) => {
    const won = match?.result === "won";
    const opponent = match?.opponent;
    const opponentName = fullName(opponent);
    const { sets, stb } = toMySide(match);
    const cols = sets.length + (stb ? 1 : 0);

    // Confeti solo la primera vez que el ganador ve este partido
    const [celebrate] = useState(() => won && match?._id && !readCelebrated(match._id));
    useEffect(() => {
        if (celebrate) writeCelebrated(match._id);
    }, [celebrate, match?._id]);

    if (!match?.result || sets.length === 0) return null;

    const { title, sub } = bannerText(won, opponentName, !!stb);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Banner de resultado */}
            <div className={`mtc-sb-banner ${won ? "mtc-sb-banner--won" : "mtc-sb-banner--lost"}`} role="status">
                {won && celebrate && (
                    <div className="mtc-sb-confetti" aria-hidden="true">
                        {CONFETTI.map((p, i) => (
                            <span key={i} style={{ "--x": p.x, "--c": p.c, "--d": p.d, "--dx": p.dx, "--r": p.r }} />
                        ))}
                    </div>
                )}
                <div className="mtc-sb-banner-icon">{won ? <TrophyFilled /> : <RiseOutlined />}</div>
                <div style={{ minWidth: 0 }}>
                    <div className="mtc-sb-banner-title">{title}</div>
                    <div className="mtc-sb-banner-sub">{sub}</div>
                </div>
            </div>

            {/* Marcador */}
            <div className="mtc-sb-board">
                <div className="mtc-sb-row mtc-sb-row--head" style={{ "--cols": cols }}>
                    <div className="mtc-sb-player" style={{ fontWeight: 600, color: "inherit" }}>Player</div>
                    {sets.map((_, i) => (
                        <div key={i} style={{ textAlign: "center" }}>Set {i + 1}</div>
                    ))}
                    {stb && <div className="mtc-sb-head-stb" title="Super tie break">STB</div>}
                </div>

                <ScoreRow
                    label="You"
                    avatar={<Avatar size={28} icon={<UserOutlined />} style={{ background: "#0B2C3D", flex: "0 0 auto" }} />}
                    values={sets}
                    stbValue={stb}
                    isWinner={won}
                    side="me"
                    cols={cols}
                    rowIndex={0}
                />
                <ScoreRow
                    label={opponentName}
                    avatar={
                        // key: ProfilePicture guarda la URL en estado interno; al cambiar de rival hay que remontarlo
                        <ProfilePicture key={opponent?._id ?? "deleted"} user={opponent} profilePicture={opponent?.profilePicture?.url} size={28} editable={false} />
                    }
                    values={sets}
                    stbValue={stb}
                    isWinner={!won}
                    side="opp"
                    cols={cols}
                    rowIndex={1}
                />
            </div>

            <div className="mtc-sb-footer">
                <span>
                    {match.reportedBy
                        ? `Reported by ${match.reportedBy === "me" ? "you" : "your opponent"}`
                        : match.resultSource === "Admin"
                            ? "Result set by the administration"
                            : ""}
                </span>
                {match.playedAt && <span>{fmtShortDate(match.playedAt)}</span>}
            </div>
        </div>
    );
};

export default RankingMatchScoreboard;