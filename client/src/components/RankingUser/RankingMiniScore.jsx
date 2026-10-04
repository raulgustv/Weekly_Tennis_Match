// [NUEVO ARCHIVO] src/components/Ranking/RankingMiniScore.jsx
// Mini marcador reutilizable (más discreto que RankingMatchScoreboard):
// tarjeta con barra lateral de color, cabecera (ronda/partido + insignia) y
// dos filas de jugador con sus games por set y, si hubo, el súper tie break.
// Lo usan RankingMatchHistory (mis partidos anteriores) y RankingRoundMatches
// (partidos públicos de la ronda). Solo pinta: no llama a la API.
//
// Props:
//   title    texto de la cabecera ("Round 2", "Match 3")
//   badge    { label, variant }  variant: won | lost | pending | disputed | neutral
//   variant  color de la barra lateral: won | lost | pending | disputed | (otro = gris)
//   mine     resalta el borde (partido del usuario logueado)
//   top / bottom  { player, label?, isMe?, isWinner? }  (label sustituye al nombre, p. ej. "You")
//   sets     [{ top, bottom }]   stb { top, bottom } | null
//   index    posición en la lista (retraso escalonado de la animación de entrada)
import ProfilePicture from "../uploads/ProfilePicture";
import "../../styles/Rankingscoreboard.css";

const fullName = (p) => (p ? [p.name, p.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user");

const PlayerRow = ({ side, data, sets, stb, cols }) => {
    const other = side === "top" ? "bottom" : "top";
    return (
        <div className={`mtc-ms-row${data.isWinner ? " mtc-ms-row--winner" : ""}`} style={{ "--cols": cols }}>
            <div className="mtc-ms-player">
                {/* key: ProfilePicture guarda la URL en estado interno; al cambiar de jugador hay que remontarlo */}
                <ProfilePicture
                    key={data.player?._id ?? "deleted"}
                    user={data.player}
                    profilePicture={data.player?.profilePicture?.url}
                    size={24}
                    editable={false}
                />
                <span className="mtc-ms-name">{data.label || fullName(data.player)}</span>
                {data.isMe && !data.label && <span className="mtc-ms-you">YOU</span>}
            </div>
            {sets.map((s, i) => (
                <div key={i} className={`mtc-ms-cell${s[side] > s[other] ? " mtc-ms-cell--win" : ""}`}>
                    {s[side]}
                </div>
            ))}
            {stb && (
                <div className={`mtc-ms-cell mtc-ms-stb${stb[side] > stb[other] ? " mtc-ms-cell--win" : ""}`} title="Super tie break">
                    {stb[side]}
                </div>
            )}
        </div>
    );
};

const RankingMiniScore = ({ title, badge, variant, mine = false, top, bottom, sets = [], stb = null, index = 0 }) => {
    const cols = sets.length + (stb ? 1 : 0);

    return (
        <div
            className={`mtc-ms-card${variant ? ` mtc-ms-card--${variant}` : ""}${mine ? " mtc-ms-card--mine" : ""}`}
            style={{ "--d": `${Math.min(index, 10) * 60}ms` }}
        >
            <div className="mtc-ms-head">
                <span className="mtc-ms-chip">{title}</span>
                {badge && <span className={`mtc-ms-badge mtc-ms-badge--${badge.variant || "neutral"}`}>{badge.label}</span>}
            </div>

            <PlayerRow side="top" data={top} sets={sets} stb={stb} cols={cols} />
            {/* Sin resultado todavía: separador "vs" entre los dos jugadores */}
            {cols === 0 && <div className="mtc-ms-vs">vs</div>}
            <PlayerRow side="bottom" data={bottom} sets={sets} stb={stb} cols={cols} />
        </div>
    );
};

export default RankingMiniScore;