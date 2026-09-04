// =====================================================================
// NtrpLevelGuide.jsx  —  NUEVO ARCHIVO
// =====================================================================
// Modal con la guía granular de niveles NTRP (1.0 a 5.0, pasos de 0.5)
// para dar criterio objetivo a la hora de votar.
//
// Mensaje central (pedido explícitamente): un mal partido NO significa
// automáticamente que haya que bajarle el nivel a alguien. Si su juego
// encaja, en general, con los criterios de su NTRP actual (por ejemplo:
// segundo saque poco fiable, footwork limitado, puntos que se acaban
// pronto), puede que simplemente ESE sea su nivel — no un mal día. Ese
// mensaje se muestra en un Alert al principio del modal, de forma
// objetiva y sutil (sin sermonear), y luego se ofrece la guía completa
// para que el votante compare lo que vio en pista con el criterio real
// de cada nivel.
//
// Uso:
//   <NtrpLevelGuide />                         → botón con texto por defecto
//   <NtrpLevelGuide triggerLabel="..." />       → botón con texto custom
//   <NtrpLevelGuide renderTrigger={(open) => ...} /> → trigger 100% custom
// =====================================================================

import { useState } from "react";
import { Modal, Button, Collapse, Tag, Typography, Alert, Flex } from "antd";
import {
    ReadOutlined,
    InfoCircleOutlined,
    AimOutlined,
    ThunderboltOutlined,
    EnvironmentOutlined,
    BulbOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import NTRP_LEVEL_GUIDE, {
    NTRP_CRITERIA_KEYS,
    NTRP_BANDS,
} from "../../helpers/ntrpGuide";

const { Text, Paragraph } = Typography;

// Metadatos (icono + etiqueta legible) de cada categoría de criterio.
// El orden de este array define el orden en el que se listan dentro de
// cada nivel — debe mantenerse alineado con NTRP_CRITERIA_KEYS.
const CRITERIA_META = {
    consistency: {
        label: "Consistency & rallies",
        icon: <AimOutlined />,
    },
    serve: {
        label: "Serve",
        icon: <ThunderboltOutlined />,
    },
    footwork: {
        label: "Footwork & court coverage",
        icon: <EnvironmentOutlined />,
    },
    strategy: {
        label: "Strategy & anticipation",
        icon: <BulbOutlined />,
    },
    doubles: {
        label: "Net play & doubles",
        icon: <TeamOutlined />,
    },
};

const NtrpLevelGuide = ({ triggerLabel = "View full NTRP level guide", renderTrigger }) => {
    const [open, setOpen] = useState(false);

    // Construye los items del Collapse a partir de los datos de
    // ntrpLevelGuide.js — así el JSX no mezcla contenido con lógica.
    const collapseItems = NTRP_LEVEL_GUIDE.map((entry) => {
        const band = NTRP_BANDS[entry.band];

        return {
            key: String(entry.level),
            label: (
                <Flex align="center" gap={10}>
                    <Text strong style={{ fontSize: 14 }}>
                        NTRP {entry.level.toFixed(1)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12.5 }}>
                        {entry.title}
                    </Text>
                    {band && (
                        <Tag color={band.color} style={{ marginLeft: "auto", marginRight: 0 }}>
                            {band.label}
                        </Tag>
                    )}
                </Flex>
            ),
            children: (
                <Flex vertical gap={10}>
                    {NTRP_CRITERIA_KEYS.map((key) => (
                        <Flex key={key} align="flex-start" gap={10}>
                            <span
                                style={{
                                    color: "#1677ff",
                                    fontSize: 14,
                                    marginTop: 2,
                                }}
                            >
                                {CRITERIA_META[key].icon}
                            </span>
                            <div>
                                <Text strong style={{ fontSize: 12.5 }}>
                                    {CRITERIA_META[key].label}
                                </Text>
                                <div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12.5, lineHeight: 1.6 }}
                                    >
                                        {entry.criteria[key]}
                                    </Text>
                                </div>
                            </div>
                        </Flex>
                    ))}
                </Flex>
            ),
        };
    });

    return (
        <>
            {/* Trigger: por defecto un Button, pero se puede sobreescribir */}
            {/* para reutilizar este modal desde otros sitios (p.ej. desde */}
            {/* el Help Center) sin duplicar el disparador.                */}
            {renderTrigger ? (
                renderTrigger(() => setOpen(true))
            ) : (
                <Button
                    icon={<ReadOutlined />}
                    onClick={() => setOpen(true)}
                    style={{ fontWeight: 600 }}
                >
                    {triggerLabel}
                </Button>
            )}

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => setOpen(false)}
                okText="Got it"
                cancelButtonProps={{ style: { display: "none" } }}
                title={
                    <Flex align="center" gap={10}>
                        <ReadOutlined style={{ color: "#1677ff" }} />
                        <span>NTRP Level Guide</span>
                    </Flex>
                }
                width={640}
                centered
            >
                <Paragraph type="secondary" style={{ marginBottom: 16, fontSize: 13 }}>
                    A quick reference for what each NTRP level typically looks like
                    on court — useful context before you vote Lower, Correct, or
                    Higher.
                </Paragraph>

                {/* Mensaje central: un mal partido no siempre significa un    */}
                {/* nivel más bajo — puede que sea, sencillamente, su nivel.   */}
                <Alert
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    title="A rough match isn't automatically a lower level"
                    description="Every NTRP level comes with its own typical mix of strengths and gaps. An unreliable second serve, limited footwork, or points that end early can simply be part of how someone plays at that level — not a one-off bad day. Compare what you saw with the criteria below before deciding your vote."
                    style={{ marginBottom: 18, borderRadius: 12 }}
                />

                <Collapse
                    items={collapseItems}
                    accordion
                    bordered
                    style={{ borderRadius: 12 }}
                />

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 14,
                        fontSize: 11.5,
                    }}
                >
                    Levels above 5.0 are considered professional-level play and fall
                    outside the scope of this guide. This guide is meant as a general
                    reference, not an official NTRP certification.
                </Text>
            </Modal>
        </>
    );
};

export default NtrpLevelGuide;