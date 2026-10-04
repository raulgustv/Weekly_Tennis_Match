// NUEVO ARCHIVO: client/src/components/ranking/RankingRulesSummary.jsx
// Resumen del "MTC Ranking Reglamento" (v1) que el jugador acepta al registrarse.
// Si cambia el reglamento: actualizar este texto Y subir RANKING_RULES_VERSION
// en server/controller/ranking.js, para que quede registrado qué versión aceptó cada uno.

import { Collapse, Typography } from "antd";

const { Paragraph } = Typography;

const sections = [
    {
        key: "eligibility",
        label: "Player eligibility",
        items: [
            "You must register with valid information and a verified account.",
            "You must be at least 18 years old.",
            "Each player may hold only one active ranking.",
            "You agree to the MTC community guidelines.",
        ],
    },
    {
        key: "validity",
        label: "Match validity & results",
        items: [
            "A match counts once the round is published and both players agree to play.",
            "Results must be submitted before the round closes (every other Sunday at 21:00, Madrid time). No exceptions.",
            "At least one of the two players must submit the result.",
            "If no result is submitted before the round closes, the match is resolved by the administration and both players receive 1 penalty point. The administration's decision cannot be disputed.",
            "Incorrect or fraudulent results may lead to suspension.",
        ],
    },
    {
        key: "format",
        label: "Match format",
        items: [
            "Best of 2 sets. A set is won at 6 games with a 2-game difference; at 7-7 a tie break to 7 is played (2-point difference).",
            "Optional: if the sets are tied 1-1, the deciding set can be a super tie break to 10 (2-point difference).",
            "Alternative formats require the agreement of both players.",
        ],
    },
    {
        key: "scheduling",
        label: "Scheduling & cancellations",
        items: [
            "Players are fully responsible for scheduling their matches.",
            "A no-show loses the match and receives 1 penalty point.",
            "Cancellations must be communicated at least 24 hours in advance. Repeated last-minute cancellations may result in a penalty point.",
            "If weather prevents play, players must coordinate rescheduling with the sports center.",
        ],
    },
    {
        key: "calculation",
        label: "Ranking calculation",
        items: [
            "The ranking is updated when the next round is generated.",
            "An internal rating system is used to create balanced matches. The ranking never changes your NTRP level.",
            "Retiring from the ranking means losing your ranking position.",
            "New and returning players start at the last ranking position.",
        ],
    },
    {
        key: "penalties",
        label: "Code of conduct & penalties",
        items: [
            "Treat every player with respect. Racism, discrimination or harassment result in immediate suspension.",
            "Penalty points can be issued for no-shows, late cancellations, avoiding result reporting, verbal abuse, aggressive behaviour or cheating.",
            "3 points: 2-round suspension. 4 points: 3-round suspension. 5 points: 2-year suspension.",
            "Suspended players lose their ranking position. Penalty points expire after 6 months.",
            "Admins may issue penalty points or suspensions for conduct not listed here that harms the fairness of the ranking.",
        ],
    },
];

const RankingSummary = () => {
    return (
        <>
            <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                The MTC Ranking exists to bring people together through tennis. Please read the
                rules below before registering — by registering you agree to follow them.
            </Paragraph>

            <Collapse
                size="small"
                items={sections.map((section) => ({
                    key: section.key,
                    label: section.label,
                    children: (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {section.items.map((text) => (
                                <li key={text} style={{ marginBottom: 6 }}>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    ),
                }))}
            />
        </>
    );
};

export default RankingSummary;