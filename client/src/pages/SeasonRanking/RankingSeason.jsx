import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Segmented, Typography } from "antd"; // [CAMBIO] quitados Col y Row, añadido Segmented
import { ArrowLeftOutlined } from "@ant-design/icons"; // [CAMBIO] quitado AppstoreOutlined (ya no se usa)
// [CAMBIO] quitado el import de RankingStatCard: la página ya no lo usa directamente (lo usa RankingSeasonList)

import useNow from "../../hooks/useNow";
import { getSeasons } from "../../actions/ranking";
import { BRAND, TYPE_META } from "../../helpers/seasonConsants";
import RankingSeasonList from "../../components/SeasonRanking/RankingSeasonList";

const { Title, Text } = Typography;

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

// Fecha de inicio para ordenar (más reciente primero); inválida/ausente va al final
const startTime = (s) => {
    const t = new Date(s?.startDate).getTime();
    return Number.isNaN(t) ? -Infinity : t;
};

const ALL = "All"; // [NUEVO] valor del filtro "todas"

const RankingSeason = () => {
    const navigate = useNavigate();
    const now = useNow();

    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    // Carga de temporadas desde tu getSeasons (sin cambios)
    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getSeasons();
                const list = Array.isArray(data) ? data : Array.isArray(data?.seasons) ? data.seasons : [];
                if (active) setSeasons(list);
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load seasons. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const counts = useMemo(() => {
        const result = Object.fromEntries(Object.keys(TYPE_META).map((t) => [t, 0]));
        seasons.forEach((s) => {
            if (Object.prototype.hasOwnProperty.call(TYPE_META, s?.type)) result[s.type] += 1;
        });
        return result;
    }, [seasons]);

    const visibleSeasons = useMemo(
        () =>
            seasons
                .filter((s) => !selectedType || s?.type === selectedType)
                .sort((a, b) => startTime(b) - startTime(a)),
        [seasons, selectedType]
    );

    // [NUEVO] Opciones del filtro: "All (6)", "❄️ Winter (3)"... ("—" mientras carga)
    const filterOptions = useMemo(
        () => [
            { label: `All (${loading ? "—" : seasons.length})`, value: ALL },
            ...Object.entries(TYPE_META).map(([type, meta]) => ({
                label: `${meta.emoji} ${type} (${loading ? "—" : counts[type]})`,
                value: type,
            })),
        ],
        [loading, seasons.length, counts]
    );

    // [CAMBIO] Eliminado toggleType: ahora el filtro lo gestiona el Segmented

    return (
        <Flex vertical gap={24}>
            <div style={{ background: BRAND.gradient, borderRadius: 18, padding: "24px 28px", color: "#FFFFFF" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ color: "#FFFFFF", paddingInline: 0, marginBottom: 8 }}
                >
                    Back
                </Button>
                <Title level={2} style={{ color: "#FFFFFF", margin: 0 }}>
                    Seasons
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>Create and manage ranking seasons</Text>
            </div>

            {/* [CAMBIO] Antes: fila de 5 <RankingStatCard> como contadores (salían "Untitled season").
                Ahora: filtro Segmented de antd con los mismos conteos. Scroll horizontal en móvil. */}
            <div style={{ overflowX: "auto" }}>
                <Segmented
                    size="large"
                    options={filterOptions}
                    value={selectedType ?? ALL}
                    onChange={(value) => setSelectedType(value === ALL ? null : value)}
                />
            </div>

            <RankingSeasonList
                seasons={visibleSeasons}
                loading={loading}
                error={error}
                selectedType={selectedType}
                now={now}
            />
        </Flex>
    );
};

export default RankingSeason;