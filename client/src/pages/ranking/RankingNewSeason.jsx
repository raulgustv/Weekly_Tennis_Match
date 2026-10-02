// 🟢 ARCHIVO COMPLETO: client/src/pages/season/RankingNewSeason.jsx
// (antes lo llamé CreateSeason.jsx — mismo componente, renombrado y con el layout rediseñado)
// Ruta: /admin/seasons/new (solo admin, dentro de AdminOnlyRoute)
//
// 🟢 CAMBIOS respecto a tu versión:
//   - Cabecera con el degradado de la app + botón "Back" visible (antes era
//     un icono type="text" gris casi invisible sobre fondo blanco).
//   - Título con <Title> (antes <Text level={3}>: Text NO acepta `level`).
//   - Formulario en Card, dividido en 2 secciones + vista previa del calendario.
//   - Botones de acción al pie, alineados a la derecha (apilados en móvil).
//
// Requiere client/src/actions/season.js (createSeason).
// Nota antd: `styles={{ body: ... }}` en Card necesita antd >= 5.14;
// en versiones anteriores usa `bodyStyle={{ ... }}`.

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

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// 🟢 CAMBIO: constantes fuera del componente (no se recrean en cada render)
const SEASON_TYPES = ["Winter", "Spring", "Summer", "Fall"];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // 24h HH:mm
const CURRENT_YEAR = new Date().getFullYear();
const PREVIEW_ROUNDS = 4;

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

    const isNotSunday = !!closeDate && closeDate.day() !== 0;
    const validTime = TIME_REGEX.test(closeTime || "");

    // Próximos cierres de ronda (solo visual; el cálculo real lo hace el backend)
    const previewDates = useMemo(() => {
        if (!closeDate || !interval || !validTime) return [];
        return Array.from({ length: PREVIEW_ROUNDS }, (_, i) =>
            closeDate.add(i * interval, "day")
        );
    }, [closeDate, interval, validTime]);

    const handleSubmit = async (values) => {        
        if(loading) return;
        setLoading(true)

        try {   
            const {data} = await newSeason({
                name: values.name.trim(),
                year: values.year,
                type: values.type,
                roundCloseTime: values.roundCloseTime.trim(),
                roundIntervalDays: values.roundIntervalDays,
                nextRoundCloseDate: values.nextRoundCloseDate.format("YYYY-MM-DD")
            })  
            toast.success(`Season ${data?.season?.name} has been successfully created`)
            navigate(data?.season?._id ? `/admin/seasons/${data?.season?._id}` : 'admin/seasons' )
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error creating season')
            
            //setLoading(false)
        }finally{
            setLoading(false)
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