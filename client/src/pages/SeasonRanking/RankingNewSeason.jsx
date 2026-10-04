
import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Flex,
    Form,
    Grid,
    Input,
    InputNumber,
    Row,
    Select,
    Tag,
    Timeline,
    Typography,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { newSeason } from "../../actions/ranking";
// [NUEVO] Helpers de hora de Madrid. Ruta deducida de la tuya en RankingStatCard
// (components/ranking → "../utils/Madridtime.js" = src/components/utils/Madridtime.js).
import { buildMadridMoment, fmtDateTime } from "../../components/utils/Madridtime.js";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// 🟢 CAMBIO: constantes fuera del componente (no se recrean en cada render)
const SEASON_TYPES = ["Winter", "Spring", "Summer", "Fall"];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // 24h HH:mm
const CURRENT_YEAR = new Date().getFullYear();
const PREVIEW_ROUNDS = 4;

// [NUEVO] Convierte el valor dayjs del DatePicker (fecha + hora elegidas) a un Date real
// interpretando esa fecha/hora como hora de Madrid, independientemente de la zona del navegador.
const toMadridDate = (value) =>
    value ? buildMadridMoment(value.format("YYYY-MM-DD"), value.format("HH:mm")) : null;

// Título de sección reutilizable (icono + título + subtítulo)
const SectionHeader = ({ icon, title, subtitle }) => (
    <Flex gap={12} align="flex-start" style={{ marginBottom: 16 }}>
        <Flex
            align="center"
            justify="center"
            style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#E8F5EC",
                color: "#1E7F43",
                fontSize: 18,
                flexShrink: 0,
            }}
        >
            {icon}
        </Flex>
        <Flex vertical>
            <Text strong style={{ fontSize: 15 }}>{title}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>{subtitle}</Text>
        </Flex>
    </Flex>
);

const RankingNewSeason = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // 🟢 CAMBIO: se observan los campos para la vista previa en vivo
    const closeDate = Form.useWatch("nextRoundCloseDate", form);
    const closeTime = Form.useWatch("roundCloseTime", form);
    const interval = Form.useWatch("roundIntervalDays", form);
    const seasonName = Form.useWatch("name", form);
    const registrationDeadline = Form.useWatch("registrationDeadline", form); // [NUEVO]

    const isNotSunday = !!closeDate && closeDate.day() !== 0;
    const validTime = TIME_REGEX.test(closeTime || "");

    // Próximos cierres de ronda (solo visual; el cálculo real lo hace el backend)
    const previewDates = useMemo(() => {
        if (!closeDate || !interval || !validTime) return [];
        return Array.from({ length: PREVIEW_ROUNDS }, (_, i) =>
            closeDate.add(i * interval, "day")
        );
    }, [closeDate, interval, validTime]);

    // [NUEVO] Regla del campo registrationDeadline:
    // opcional; si se rellena → futura y anterior al cierre de la primera ronda (ambas en hora de Madrid)
    const registrationDeadlineRule = ({ getFieldValue }) => ({
        validator: (_, value) => {
            if (!value) return Promise.resolve();

            const deadline = toMadridDate(value);
            if (!deadline || deadline.getTime() <= Date.now()) {
                return Promise.reject(new Error("The registration deadline must be in the future"));
            }

            const firstClose = getFieldValue("nextRoundCloseDate");
            const firstCloseTime = getFieldValue("roundCloseTime");
            if (firstClose && TIME_REGEX.test(firstCloseTime || "")) {
                const firstRoundClose = buildMadridMoment(firstClose.format("YYYY-MM-DD"), firstCloseTime);
                if (firstRoundClose && deadline.getTime() >= firstRoundClose.getTime()) {
                    return Promise.reject(
                        new Error("Registration must close before the first round closes")
                    );
                }
            }
            return Promise.resolve();
        },
    });

    const handleSubmit = async (values) => {
        if (loading) return;
        setLoading(true);

        try {
            // [NUEVO] ISO en UTC calculado como hora de Madrid; undefined si no se rellenó (JSON lo omite)
            const deadline = toMadridDate(values.registrationDeadline);

            const { data } = await newSeason({
                name: values.name.trim(),
                year: values.year,
                type: values.type,
                roundCloseTime: values.roundCloseTime.trim(),
                roundIntervalDays: values.roundIntervalDays,
                nextRoundCloseDate: values.nextRoundCloseDate.format("YYYY-MM-DD"),
                registrationDeadline: deadline ? deadline.toISOString() : undefined, // [NUEVO]
            });
            toast.success(`Season ${data?.season?.name} has been successfully created`);
            // [CAMBIO] faltaba la "/" inicial: 'admin/seasons' navegaba de forma relativa a una ruta incorrecta
            navigate("/admin/seasons");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error creating season");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex vertical gap={20} style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>

            {/* ================= PAGE HEADER ================= */}
            <div
                style={{
                    background: "linear-gradient(90deg, #0B2C3D 0%, #1E7F43 100%)",
                    borderRadius: 12,
                    padding: isMobile ? "16px" : "20px 24px",
                    color: "#fff",
                }}
            >
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/admin/seasons")}
                    style={{
                        background: "rgba(255,255,255,0.12)",
                        borderColor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        marginBottom: 12,
                    }}
                >
                    Back to seasons
                </Button>

                <Flex align="center" gap={12}>
                    <TrophyOutlined style={{ fontSize: isMobile ? 24 : 28, color: "#F4D03F" }} />
                    <Flex vertical>
                        <Title level={isMobile ? 4 : 3} style={{ margin: 0, color: "#fff" }}>
                            Create season
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                            Set up a new MTC Ranking season and its round schedule.
                        </Text>
                    </Flex>
                </Flex>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
                disabled={loading}
                initialValues={{
                    year: CURRENT_YEAR,
                    roundCloseTime: "21:00",
                    roundIntervalDays: 14,
                }}
            >
                <Row gutter={[20, 20]}>

                    {/* ================= FORM ================= */}
                    <Col xs={24} lg={15}>
                        <Card style={{ borderRadius: 12 }} styles={{ body: { padding: isMobile ? 16 : 24 } }}>

                            <SectionHeader
                                icon={<InfoCircleOutlined />}
                                title="Season details"
                                subtitle="How the season will be identified."
                            />

                            <Form.Item
                                label="Season name"
                                name="name"
                                rules={[
                                    { required: true, whitespace: true, message: "Please enter a season name" },
                                    { max: 60, message: "Maximum 60 characters" },
                                ]}
                            >
                                <Input size="large" placeholder="e.g. MTC Ranking Fall 2026" maxLength={60} showCount />
                            </Form.Item>

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Type"
                                        name="type"
                                        rules={[{ required: true, message: "Please select the season type" }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Select type"
                                            options={SEASON_TYPES.map((t) => ({ value: t, label: t }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Year"
                                        name="year"
                                        rules={[{ required: true, message: "Please enter the year" }]}
                                    >
                                        <InputNumber
                                            size="large"
                                            min={CURRENT_YEAR - 1}
                                            max={CURRENT_YEAR + 2}
                                            precision={0}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider style={{ margin: "8px 0 24px" }} />

                            <SectionHeader
                                icon={<CalendarOutlined />}
                                title="Round schedule"
                                subtitle="All times are Madrid time. Rounds normally close every other Sunday at 21:00."
                            />

                            <Form.Item
                                label="First round closes on"
                                name="nextRoundCloseDate"
                                rules={[{ required: true, message: "Please select the first round close date" }]}
                            >
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    format="ddd, DD MMM YYYY"
                                    // 🟢 CAMBIO: sin fechas pasadas (el cron cerraría la ronda nada más activarla)
                                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                                />
                            </Form.Item>

                            {isNotSunday && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                    title="The selected date is not a Sunday"
                                    description="The ranking rules say rounds close on Sundays. You can continue, but double-check the date."
                                />
                            )}

                            <Row gutter={12}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Close time"
                                        name="roundCloseTime"
                                        rules={[
                                            { required: true, message: "Please enter the close time" },
                                            { pattern: TIME_REGEX, message: "Use 24h format HH:mm (e.g. 21:00)" },
                                        ]}
                                    >
                                        <Input size="large" prefix={<ClockCircleOutlined />} placeholder="21:00" maxLength={5} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Days between rounds"
                                        name="roundIntervalDays"
                                        rules={[{ required: true, message: "Please enter the round interval" }]}
                                    >
                                        <InputNumber
                                            size="large"
                                            min={7}
                                            max={28}
                                            step={7}
                                            precision={0}
                                            suffix="days"
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* [NUEVO] Cierre de inscripción (opcional, hora de Madrid).
                                dependencies: se revalida si cambia la fecha/hora de la primera ronda */}
                            <Form.Item
                                label="Registration deadline"
                                name="registrationDeadline"
                                dependencies={["nextRoundCloseDate", "roundCloseTime"]}
                                extra="Madrid time. Players cannot sign up for the season after this moment."
                                rules={[registrationDeadlineRule]}
                            >
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    showTime={{ format: "HH:mm", minuteStep: 5 }}
                                    format="ddd, DD MMM YYYY HH:mm"
                                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* ================= PREVIEW ================= */}
                    <Col xs={24} lg={9}>
                        <Card
                            style={{ borderRadius: 12, position: isMobile ? "static" : "sticky", top: 0 }}
                            styles={{ body: { padding: isMobile ? 16 : 24 } }}
                        >
                            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                                <Text strong style={{ fontSize: 15 }}>Preview</Text>
                                <Tag color="blue">UPCOMING</Tag>
                            </Flex>

                            <Text
                                strong
                                style={{ display: "block", fontSize: 16, marginBottom: 16, wordBreak: "break-word" }}
                            >
                                {seasonName?.trim() || "Untitled season"}
                            </Text>

                            {/* [NUEVO] Cierre de inscripción en la vista previa */}
                            <Flex
                                align="center"
                                gap={8}
                                style={{ background: "#F5F5F5", borderRadius: 10, padding: "8px 12px", marginBottom: 16 }}
                            >
                                <ClockCircleOutlined style={{ color: "#1E7F43" }} />
                                <Text style={{ fontSize: 13 }}>
                                    {registrationDeadline
                                        ? `Registration closes: ${fmtDateTime(toMadridDate(registrationDeadline))}`
                                        : "No registration deadline set"}
                                </Text>
                            </Flex>

                            {previewDates.length ? (
                                <>
                                    <Text type="secondary" style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
                                        Next round closes (Madrid):
                                    </Text>
                                    <Timeline
                                        items={previewDates.map((d, i) => ({
                                            color: i === 0 ? "green" : "gray",
                                            content: (
                                                <Text strong={i === 0}>
                                                    Round {i + 1} · {d.format("ddd DD MMM")} · {closeTime}
                                                </Text>
                                            ),
                                        }))}
                                    />
                                </>
                            ) : (
                                <Text type="secondary">
                                    Pick the first close date to see the round calendar.
                                </Text>
                            )}

                            <Alert
                                type="info"
                                showIcon
                                style={{ marginTop: 8 }}
                                title="The season is created as upcoming. It will not affect the ranking until you activate it."
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ================= ACTIONS ================= */}
                <Flex
                    justify="end"
                    gap={12}
                    vertical={isMobile}
                    style={{
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid #F0F0F0",
                    }}
                >
                    <Button size="large" onClick={() => navigate("/admin/seasons")} block={isMobile}>
                        Cancel
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        loading={loading}
                        block={isMobile}
                        style={{ background: "#1E7F43", borderColor: "#1E7F43" }}
                    >
                        Create season
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
};

export default RankingNewSeason;