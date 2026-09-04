// =====================================================================
// VotingCriteriaCard.jsx  —  NUEVO ARCHIVO
// =====================================================================
// Tarjeta lateral ("right side panel") que explica de forma visual y
// muy resumida el criterio de votación (Lower / Correct / Higher),
// pensada para acompañar la lista de partidos en MatchVote.jsx.
//
// Objetivo del contenido (pedido explícitamente):
//   1) Un "chart" simple, igual en espíritu al del Help Center
//      (HelpMatchVoting.jsx, paso "How to vote"), que deje claro qué
//      significa cada opción de voto.
//   2) Vender el valor del voto con objetividad: no es un juicio a la
//      persona, es una señal más para mejorar el balance de los
//      partidos. El tono es sutil, nunca insistente ni alarmista.
//
// No recibe datos reales de votos (no hay "quién votó qué" aquí), es
// un componente puramente informativo/educativo — igual que su
// homólogo del Help Center. Si en el futuro quieres mostrar
// estadísticas reales (p. ej. % de votos Lower/Correct/Higher de un
// partido concreto), este es el sitio natural para añadirlas como
// props opcionales sin romper el uso actual.
// =====================================================================

import { Card, Typography, Flex, Tag, Divider, Button } from "antd";
import {
    ArrowDownOutlined,
    MinusOutlined,
    ArrowUpOutlined,
    SafetyOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import colors from "../../themes/colors";
import NtrpLevelGuide from "../modals/NtrpLevelGuide";
// 🆕 Guía granular de niveles NTRP (1.0-5.0, pasos de 0.5), para dar
// criterio objetivo antes de votar. Ver client/src/data/ntrpLevelGuide.js


const { Title, Text, Paragraph } = Typography;

// Definición de las 3 zonas del criterio de voto.
// Centralizarlo en un array evita repetir el mismo bloque 3 veces y
// hace más fácil ajustar textos/colores en un único sitio.
const VOTE_LEVELS = [
    {
        key: "lower",
        label: "Lower",
        icon: <ArrowDownOutlined />,
        color: colors.danger,
        description: "Playing level seemed lower than their NTRP.",
    },
    {
        key: "correct",
        label: "Correct",
        icon: <MinusOutlined />,
        color: colors.success,
        description: "Playing level matched their NTRP.",
    },
    {
        key: "higher",
        label: "Higher",
        icon: <ArrowUpOutlined />,
        color: colors.info,
        description: "Playing level seemed higher than their NTRP.",
    },
];

const VotingCriteriaCard = ({ style }) => {
    const navigate = useNavigate();

    return (
        <Card
            variant="borderless"
            style={{
                borderRadius: 16,
                border: `1px solid ${colors.bgSoft}`,
                boxShadow: "0 6px 20px rgba(0,0,0,.05)",
                ...style,
            }}
            styles={{ body: { padding: 20 } }}
        >
            {/* ---------------------------------------------------- */}
            {/* CABECERA */}
            {/* ---------------------------------------------------- */}
            <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "#f0f5ff",
                        color: colors.info,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                    }}
                >
                    <BulbOutlined />
                </div>

                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        Voting criteria
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        A quick guide before you vote
                    </Text>
                </div>
            </Flex>

            <Divider style={{ margin: "16px 0" }} />

            {/* ---------------------------------------------------- */}
            {/* "CHART": barra de espectro Lower — Correct — Higher   */}
            {/* Es una representación simple e inmediata: a un lado   */}
            {/* el nivel percibido es más bajo, en el centro coincide */}
            {/* con el NTRP actual, y al otro lado es más alto.       */}
            {/* ---------------------------------------------------- */}
            <div
                style={{
                    height: 10,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${colors.danger} 0%, ${colors.danger} 30%, ${colors.success} 30%, ${colors.success} 70%, ${colors.info} 70%, ${colors.info} 100%)`,
                }}
            />

            <Flex justify="space-between" style={{ marginTop: 12 }}>
                {VOTE_LEVELS.map((level, index) => (
                    <div
                        key={level.key}
                        style={{
                            flex: 1,
                            textAlign:
                                index === 0
                                    ? "left"
                                    : index === VOTE_LEVELS.length - 1
                                    ? "right"
                                    : "center",
                        }}
                    >
                        <span style={{ color: level.color, fontSize: 14 }}>
                            {level.icon}
                        </span>
                        <div>
                            <Text strong style={{ fontSize: 12.5 }}>
                                {level.label}
                            </Text>
                        </div>
                    </div>
                ))}
            </Flex>

            {/* Descripciones cortas de cada zona, debajo del "chart" */}
            <Flex vertical gap={6} style={{ marginTop: 14 }}>
                {VOTE_LEVELS.map((level) => (
                    <Flex key={level.key} align="flex-start" gap={8}>
                        <span
                            style={{
                                color: level.color,
                                fontSize: 12,
                                marginTop: 2,
                            }}
                        >
                            {level.icon}
                        </span>
                        <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>
                            <strong style={{ color: level.color }}>
                                {level.label}:
                            </strong>{" "}
                            {level.description}
                        </Text>
                    </Flex>
                ))}
            </Flex>

            <Divider style={{ margin: "18px 0" }} />

            {/* ---------------------------------------------------- */}
            {/* "VENTA" OBJETIVA Y SUTIL DEL VALOR DEL VOTO           */}
            {/* No se presiona al usuario ni se le dice que "debe"    */}
            {/* votar; se explica el porqué de forma breve y honesta. */}
            {/* ---------------------------------------------------- */}
            <Paragraph
                type="secondary"
                style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 8 }}
            >
                Your vote is one more signal, combined with feedback from
                other players, that helps keep NTRP levels realistic over
                time — so future matches stay evenly balanced for everyone.
            </Paragraph>

            {/* 🆕 Mensaje clave pedido: un mal partido no implica bajar el */}
            {/* nivel — puede que simplemente sea su nivel habitual. Se     */}
            {/* deja corto aquí; la versión completa está en el modal de    */}
            {/* NtrpLevelGuide para quien quiera profundizar.               */}
            <Paragraph
                type="secondary"
                style={{ fontSize: 12.5, lineHeight: 1.7, marginBottom: 0 }}
            >
                A rough match doesn't automatically mean a lower level —
                some traits (like a shaky second serve or limited footwork)
                may simply be part of that player's usual game at their
                current NTRP.
            </Paragraph>

            {/* 🆕 Acceso a la guía granular de niveles NTRP (1.0-5.0) */}
            <NtrpLevelGuide
                renderTrigger={(open) => (
                    <Button
                        type="dashed"
                        size="small"
                        block
                        onClick={open}
                        style={{
                            marginTop: 12,
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    >
                        See what each NTRP level looks like
                    </Button>
                )}
            />

            {/* Tags rápidos: refuerzan objetividad sin repetir texto */}
            <Flex gap={6} wrap style={{ marginTop: 12 }}>
                <Tag
                    icon={<SafetyOutlined />}
                    style={{ borderRadius: 999, fontSize: 11 }}
                >
                    Anonymous
                </Tag>
                <Tag style={{ borderRadius: 999, fontSize: 11 }}>Optional</Tag>
                <Tag style={{ borderRadius: 999, fontSize: 11 }}>
                    Gradual updates
                </Tag>
            </Flex>

            <Button
                type="link"
                onClick={() => navigate("/help")}
                style={{
                    padding: 0,
                    height: "auto",
                    marginTop: 14,
                    fontWeight: 600,
                    fontSize: 12.5,
                }}
            >
                Learn more about Match Voting →
            </Button>
        </Card>
    );
};

export default VotingCriteriaCard;