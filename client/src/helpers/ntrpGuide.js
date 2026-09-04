// =====================================================================
// ntrpLevelGuide.js  —  NUEVO ARCHIVO (datos, sin JSX)
// =====================================================================
// Contenido de referencia para el criterio NTRP, en pasos de 0.5, para
// el rango que ya usa la app (1.0 — 5.0, ver client/src/components/
// utils/NTRPLevel.jsx, donde el slider va de 1 a 5 con step 0.5).
//
// Los textos son un resumen PROPIO (parafraseado, no copiado literal)
// basado en las guías públicas de auto-evaluación NTRP que publica la
// USTA (National Tennis Rating Program) y en guías de clubes/ligas que
// las resumen para jugadores recreativos:
//   - USTA, "NTRP General Characteristics" (guías de auto-rating):
//     https://www.usta.com/content/dam/usta/pdfs/10013_experience_player_ntrp_characteristics1%20(2).pdf
//     https://www.usta.com/content/dam/usta/pdfs/10013_experience_player_ntrp_guidelines.pdf
//   - Austin Tennis Net, "NTRP Self-Rating Guidelines":
//     https://www.austintennisnet.org/rules/NTRP_RATINGS_GUIDE.htm
//   - Metropolitan Tennis Group, "NTRP":
//     https://metrotennisgroup.com/ntrp
//   - PlayYourCourt, "USTA Tennis Rating Guide":
//     https://www.playyourcourt.com/news/find-your-usta-tennis-league-rating/
//
// Cada nivel se describe con las mismas 5 categorías (para poder
// comparar niveles fácilmente, p.ej. 1.5 vs 4.0), y esas categorías
// están elegidas a propósito para que coincidan con lo que un votante
// suele fijarse en la pista: consistencia, saque, footwork/movimiento,
// estrategia/anticipación y juego de dobles/red.
//
// IMPORTANTE: esto es una guía orientativa para ayudar a votar con
// criterio, no una certificación oficial NTRP.
// =====================================================================

const NTRP_LEVEL_GUIDE = [
    {
        level: 1.0,
        title: "Just picking up a racket",
        band: "beginner",
        criteria: {
            consistency:
                "Struggles to get the ball over the net or in play more than once or twice in a row.",
            serve: "No real serve yet — mostly just tossing and making contact to start the point.",
            footwork:
                "Little to no positioning; reacts late to where the ball is going.",
            strategy:
                "No shot selection yet — the only goal is making contact with the ball.",
            doubles:
                "Not yet aware of court positioning or how to work with a partner.",
        },
    },
    {
        level: 1.5,
        title: "Just starting out",
        band: "beginner",
        criteria: {
            consistency:
                "Can make contact, but rallies rarely go past a shot or two.",
            serve: "Getting the ball in play is the main goal — placement and power aren't there yet.",
            footwork: "Movement to the ball is slow and often mistimed.",
            strategy:
                "Reacting to the ball rather than planning a shot.",
            doubles:
                "Limited understanding of positioning; tends to avoid the net.",
        },
    },
    {
        level: 2.0,
        title: "Developing the basics",
        band: "beginner",
        criteria: {
            consistency:
                "Can sustain a slow rally when the ball is fed cooperatively.",
            serve: "Inconsistent toss and motion; double faults are common.",
            footwork: "Frequently out of position and late to the ball.",
            strategy:
                "Starting to understand where to stand, but rarely acts on it under pressure.",
            doubles:
                "Basic awareness of court positions, but instincts aren't there yet.",
        },
    },
    {
        level: 2.5,
        title: "Building consistency",
        band: "beginner",
        criteria: {
            consistency:
                "Can rally at a slow-to-moderate pace when the ball comes straight to them.",
            serve: "Motion is improving, but power and direction are still limited.",
            footwork:
                "Gets to easy balls; still hesitant on anything hit with real pace.",
            strategy:
                "Starting to think about shot direction, but execution is inconsistent.",
            doubles:
                "Uncomfortable at net; team positioning is still developing.",
        },
    },
    {
        level: 3.0,
        title: "Lower intermediate",
        band: "intermediate",
        criteria: {
            consistency:
                "Fairly consistent on medium-paced shots, but breaks down under pressure or against pace.",
            serve: "First serve is unreliable when trying for placement or power; second serve is safe but predictable.",
            footwork:
                "Covers routine balls reasonably well, but struggles to recover on wide or deep shots.",
            strategy:
                "Aware of basic tactics, but shot selection is still reactive rather than planned.",
            doubles:
                "Can volley when set up, but not yet comfortable finishing points at net.",
        },
    },
    {
        level: 3.5,
        title: "Solid recreational player",
        band: "intermediate",
        criteria: {
            consistency:
                "Dependable strokes with some directional control on moderate-paced shots.",
            serve: "More consistent pace and placement on the first serve; starting to direct the second serve instead of just getting it in.",
            footwork:
                "Covers the court well on medium-paced balls; can still be rushed by pace or depth.",
            strategy:
                "Growing court awareness and shot selection, though it can break down in longer points.",
            doubles:
                "Comfortable taking the net with basic volleys and some sense of team positioning.",
        },
    },
    {
        level: 4.0,
        title: "Strong all-around player",
        band: "advanced",
        criteria: {
            consistency:
                "Dependable groundstrokes with depth and directional control, even under moderate pressure.",
            serve: "Reliable first serve that can force weak returns; controlled, purposeful second serve.",
            footwork:
                "Covers the court efficiently and recovers well after being pulled wide.",
            strategy:
                "Constructs points with intent, using approach shots, lobs and overheads as needed.",
            doubles:
                "Active and confident at net, with reliable volleys and solid positioning.",
        },
    },
    {
        level: 4.5,
        title: "Advanced player",
        band: "advanced",
        criteria: {
            consistency:
                "Uses pace, spin and depth effectively, holding up under pressure in longer rallies.",
            serve: "Serves with real power and accuracy, including a second serve that limits easy attacks.",
            footwork:
                "Strong court coverage and efficient transition from baseline to net.",
            strategy:
                "Adjusts tactics mid-match and looks to exploit an opponent's weaknesses.",
            doubles:
                "Aggressive, well-positioned net play with strong poaching instincts.",
        },
    },
    {
        level: 5.0,
        title: "High-level competitive player",
        band: "competitive",
        criteria: {
            consistency:
                "Executes advanced, specialty shots consistently, even under pressure.",
            serve: "Uses the serve strategically to create offensive opportunities, varying pace and placement.",
            footwork:
                "Elite court coverage and anticipation; rarely out of position.",
            strategy:
                "Plays percentage tennis, reading the opponent and adjusting in real time.",
            doubles:
                "Advanced teamwork and net instincts, at a tournament-level of play.",
        },
    },
];

// Categorías compartidas por todos los niveles, en el orden en que se
// muestran en la UI (ver NtrpLevelGuide.jsx para los iconos/labels).
export const NTRP_CRITERIA_KEYS = [
    "consistency",
    "serve",
    "footwork",
    "strategy",
    "doubles",
];

// Colores/etiquetas por franja de nivel, usados solo para el Tag visual
// de cada panel del acordeón (no afecta a los datos en sí).
export const NTRP_BANDS = {
    beginner: { label: "Beginner", color: "default" },
    intermediate: { label: "Intermediate", color: "blue" },
    advanced: { label: "Advanced", color: "purple" },
    competitive: { label: "Competitive", color: "gold" },
};

export default NTRP_LEVEL_GUIDE;