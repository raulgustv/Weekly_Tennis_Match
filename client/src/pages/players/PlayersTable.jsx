import {
    Badge, // [CAMBIO] NUEVO: Badge.Ribbon "Ranked" encima de la foto de perfil
    Button,
    Checkbox,
    Flex,
    Image,
    Input,
    Popconfirm,
    Select, // [CAMBIO] NUEVO: selectores de filtro
    Table,
    Typography,
    Grid,
    Tooltip,
    Tag
} from "antd";
import { ClearOutlined, ReloadOutlined } from "@ant-design/icons"; // [CAMBIO] añadido ClearOutlined
import { useCountries } from "../../hooks/useCountries";
import { useMemo, useState } from "react";
import { togglePlayerActive, toggleUserRole } from "../../actions/admin";
import { toast } from "react-toastify";
import NTRPModal from "../../components/modals/NTRPModal";
import ProfilePicture from "../../components/uploads/ProfilePicture";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "../../components/common/ExportExcel";

// ------------------------------------------------------------------
// [CAMBIO] NUEVO: opciones de los filtros (textos visibles en inglés)
// ------------------------------------------------------------------
const FILTER_ALL = "all";

const RANKING_OPTIONS = [
    { value: FILTER_ALL, label: "Ranking: all" },
    { value: "ranked", label: "Ranked" },
    { value: "not_ranked", label: "Not ranked" },
];

const STATUS_OPTIONS = [
    { value: FILTER_ALL, label: "Status: all" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" },
];

const ROLE_OPTIONS = [
    { value: FILTER_ALL, label: "Role: all" },
    { value: "admin", label: "Admin" },
    { value: "booker", label: "Booker" },
    { value: "user", label: "User" },
];

const VERIFICATION_OPTIONS = [
    { value: FILTER_ALL, label: "Verification: all" },
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
];

const INITIAL_FILTERS = {
    ranking: FILTER_ALL,
    status: FILTER_ALL,
    role: FILTER_ALL,
    verification: FILTER_ALL,
};

// [CAMBIO] NUEVO: suspensión vigente (suspendedUntil en el futuro)
const isSuspended = (p) =>
    !!p?.suspendedUntil && new Date(p.suspendedUntil) > new Date();

// [CAMBIO] NUEVO: ribbon "Ranked" en la esquina superior izquierda de la fila,
// justo encima de la foto de perfil (placement="start").
// paddingTop deja el hueco del ribbon para que NO tape la foto ni el nombre.
// Verde = inscrito y activo (entrará en la próxima ronda).
// Gris = inscrito pero con la cuenta desactivada (el servidor solo empareja isRanked + isActive).
const RankedRibbon = ({ player, children }) => {
    if (!player?.isRanked) return children;

    return (
        <Badge.Ribbon
            text="Ranked"
            placement="start"
            color={player?.isActive ? "#85ac1b" : "#8C8C8C"}
        >
            <div style={{ paddingTop: 28 }}>{children}</div>
        </Badge.Ribbon>
    );
};

const PlayersTable = ({ players, loading, fetchPlayers }) => {

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();



    const { countries } = useCountries();

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState(INITIAL_FILTERS); // [CAMBIO] NUEVO
    const { Text } = Typography;
    const navigate = useNavigate();

    const countriesMap = useMemo(() => {
        return countries.reduce((acc, country) => {
            acc[country?.name.toLowerCase()] = country;
            return acc;
        }, {});
    }, [countries]);

    const playersWithCountry = useMemo(() => {
        return players.map(player => {
            const country =
                countriesMap[player.country?.trim().toLowerCase()];

            return {
                ...player,
                countryIso: country?.iso ?? null,
                countryFlag: country?.flag ?? null,
            };
        });
    }, [players, countriesMap]);

    // [CAMBIO] Búsqueda por nombre y apellido + filtros de la barra
    // (ranking, estado de la cuenta, rol y verificación). Todos se combinan (AND).
    const filteredPlayers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return playersWithCountry.filter((p) => {
            // Búsqueda por nombre (misma lógica que antes)
            if (
                term &&
                !`${p?.name ?? ""} ${p?.lastname ?? ""}`
                    .toLowerCase()
                    .includes(term)
            ) return false;

            // [CAMBIO] NUEVO: ranking
            if (filters.ranking === "ranked" && !p?.isRanked) return false;
            if (filters.ranking === "not_ranked" && p?.isRanked) return false;

            // [CAMBIO] NUEVO: estado de la cuenta
            if (filters.status === "active" && !p?.isActive) return false;
            if (filters.status === "inactive" && p?.isActive) return false;
            if (filters.status === "suspended" && !isSuspended(p)) return false;

            // [CAMBIO] NUEVO: rol
            if (filters.role !== FILTER_ALL && p?.role !== filters.role) return false;

            // [CAMBIO] NUEVO: verificación de email
            if (filters.verification === "verified" && !p?.isVerified) return false;
            if (filters.verification === "unverified" && p?.isVerified) return false;

            return true;
        });
    }, [playersWithCountry, searchTerm, filters]);

    // [CAMBIO] NUEVO: total de inscritos al ranking (sobre todos los jugadores, no solo los filtrados)
    const rankedCount = useMemo(
        () => players.filter((p) => p?.isRanked).length,
        [players]
    );

    // [CAMBIO] NUEVO
    const hasActiveFilters =
        Boolean(searchTerm.trim()) ||
        Object.values(filters).some((v) => v !== FILTER_ALL);

    // [CAMBIO] NUEVO
    const updateFilter = (key) => (value) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    // [CAMBIO] NUEVO
    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setSearchTerm("");
    };

    const toggleActivation = async (id) => {
        try {
            const res = await togglePlayerActive(id);
            const { user, active } = res;

            if (!user) return toast.error("User was not found");

            toast.success(
                `${user?.name} ${user?.lastname} has been ${active ? "activated" : "de-activated"
                }`
            );

            fetchPlayers();

        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                "There was an issue toggling player account"
            );
        }
    };

    const toggleAdminRole = async (id) => {
        try {
            const res = await toggleUserRole(id);

            toast.success(
                `User successfully changed role to ${res?.user?.role}`
            );

            fetchPlayers();

        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                "There was an issue toggling user status"
            );
        }
    };

    // ------------------------------------------------------------------
    // DESKTOP COLUMNS
    // ------------------------------------------------------------------
    const desktopColumns = [
        {
            title: "Player name",
            key: "name",
            render: (p) => (
                // [CAMBIO] NUEVO: ribbon "Ranked" encima de la foto (envuelve toda la fila
                // para que el hueco del ribbon no descuadre foto y nombre)
                <RankedRibbon player={p}>
                    <Flex
                        align="center"
                        justify="space-between"
                        gap={8}
                        style={{ width: "100%" }}
                    >
                        <Tooltip title="Click on player to view profile">
                            <Flex
                                align="center"
                                gap={8}
                                style={{
                                    minWidth: 0,
                                    overflow: "hidden",
                                    flex: 1,
                                    cursor: "pointer"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/player/${p._id}`);
                                }}
                                justify="space-between"
                            >
                                <ProfilePicture
                                    profilePicture={p?.profilePicture?.url}
                                    user={p}
                                    size={28}
                                    editable={false}
                                />

                                <span
                                    style={{
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {p?.name} {p?.lastname}
                                </span>
                                {
                                    // [CAMBIO] FIX: antes p?.notesHistory.length rompía si notesHistory no existía
                                    p?.notesHistory?.length > 0 && (
                                        <Tag
                                            style={{
                                                margin: 0,
                                                fontSize: 11,
                                                lineHeight: '20px'
                                            }}
                                            color="orange"
                                        >
                                            {p.notesHistory.length} notes
                                        </Tag>
                                    )
                                }
                            </Flex>
                        </Tooltip>

                        {/* [CAMBIO] antes type="text" (sin color). Ahora azul suave del tema */}
                        <Button
                            color="primary"
                            variant="filled"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/player/${p._id}`);
                            }}
                        >
                            View
                        </Button>
                    </Flex>
                </RankedRibbon>
            ),
            filters: players.map((p) => ({
                text: `${p?.name} ${p?.lastname}`,
                value: `${p?._id}`
            })),
            filterSearch: true,
            onFilter: (value, record) => record?._id === value,
            sorter: (a, b) => {
                const nameA =
                    `${a?.name} ${a?.lastname}`.toLowerCase();
                const nameB =
                    `${b?.name} ${b?.lastname}`.toLowerCase();

                return nameA.localeCompare(nameB);
            },
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email"
        },
        {
            title: "Phone #",
            key: "phone",
            dataIndex: "phone"
        },
        {
            title: "Country",
            key: "country",
            render: (p) => (
                <Flex justify="space-between" align="center" gap="small">
                    <span>{p?.country}</span>

                    <Image
                        preview={false}
                        width={25}
                        alt={`${p?.country} flag`}
                        src={p?.countryFlag}
                    />
                </Flex>
            )
        },
        {
            title: "NTRP Level",
            key: "ntrplvl",
            render: (p) => (
                <Flex justify="center" align="center" gap="middle">
                    {/* [CAMBIO] FIX: antes p?.ntrplvl.toFixed(1) rompía la tabla si el jugador no tenía NTRP */}
                    <span>{p?.ntrplvl != null ? p.ntrplvl.toFixed(1) : "—"}</span>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => setSelectedPlayer(p)}
                    >
                        Adjust
                    </Button>
                </Flex>
            ),
            // [CAMBIO] NUEVO: ordenar por NTRP (los que no tienen van al final)
            sorter: (a, b) => (a?.ntrplvl ?? -1) - (b?.ntrplvl ?? -1),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Active",
            key: "active",
            render: (p) => (
                <Popconfirm
                    title={
                        p?.isActive
                            ? "Deactivate player?"
                            : "Activate player?"
                    }
                    description={
                        p?.isActive
                            ? "This player will no longer be active"
                            : "This player will be activated"
                    }
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => toggleActivation(p?._id)}
                >
                    <Checkbox checked={p?.isActive}>
                        Active player
                    </Checkbox>
                </Popconfirm>
            )
        },
        {
            title: "Role",
            key: "role",
            render: (p) => (
                <Flex
                    align="center"
                    gap="small"
                    style={{ width: "100%" }}
                >
                    <Text
                        type="secondary"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {p?.role}
                    </Text>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => toggleAdminRole(p?._id)}
                    >
                        Toggle role
                    </Button>
                </Flex>
            )
        }
    ];

    // ------------------------------------------------------------------
    // MOBILE COLUMNS
    // ------------------------------------------------------------------
    const mobileColumns = [
        {
            title: "Player",
            key: "player-mobile",
            render: (p) => (
                <Flex vertical gap={8} style={{ width: "100%" }}>

                    {/* [CAMBIO] NUEVO: ribbon "Ranked" encima de la foto (envuelve la fila de nombre + botón) */}
                    <RankedRibbon player={p}>
                        <Flex
                            align="center"
                            justify="space-between"
                            gap={8}
                        >
                            <Flex
                                align="center"
                                gap={8}
                                style={{
                                    minWidth: 0,
                                    cursor: "pointer"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/player/${p._id}`);
                                }}
                            >
                                <ProfilePicture
                                    profilePicture={p?.profilePicture?.url}
                                    user={p}
                                    size={32}
                                    editable={false}
                                />

                                <span
                                    style={{
                                        fontWeight: 600,
                                        whiteSpace: "normal",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {p?.name} {p?.lastname}
                                </span>
                                {
                                    // [CAMBIO] FIX: mismo arreglo que en desktop (notesHistory opcional)
                                    p?.notesHistory?.length > 0 && (
                                        <Tag
                                            style={{
                                                margin: 0,
                                                fontSize: 11,
                                                lineHeight: "20px",
                                                flexShrink: 0
                                            }}
                                            color="orange"
                                        >
                                            {p.notesHistory.length} notes
                                        </Tag>
                                    )
                                }
                            </Flex>

                            <Button
                                type="primary"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/player/${p._id}`);
                                }}
                            >
                                View profile
                            </Button>
                        </Flex>
                    </RankedRibbon>

                    <Flex vertical gap={0}>
                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            {p?.email}
                        </Text>

                        <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            {p?.phone}
                        </Text>
                    </Flex>

                    <Flex
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        gap={8}
                    >
                        <Flex align="center" gap={6}>
                            <Image
                                preview={false}
                                width={18}
                                alt={`${p?.country} flag`}
                                src={p?.countryFlag}
                            />

                            <span>{p?.country}</span>
                        </Flex>

                        <Flex align="center" gap={6}>
                            <span>
                                {/* [CAMBIO] FIX: mismo arreglo que en desktop (NTRP opcional) */}
                                NTRP {p?.ntrplvl != null ? p.ntrplvl.toFixed(1) : "—"}
                            </span>

                            <Button
                                size="small"
                                type="primary"
                                onClick={() =>
                                    setSelectedPlayer(p)
                                }
                            >
                                Adjust
                            </Button>
                        </Flex>
                    </Flex>

                    <Flex
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        gap={8}
                    >
                        <Popconfirm
                            title={
                                p?.isActive
                                    ? "Deactivate player?"
                                    : "Activate player?"
                            }
                            description={
                                p?.isActive
                                    ? "This player will no longer be active"
                                    : "This player will be activated"
                            }
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() =>
                                toggleActivation(p?._id)
                            }
                        >
                            <Checkbox checked={p?.isActive}>
                                Active
                            </Checkbox>
                        </Popconfirm>

                        <Flex align="center" gap={6}>
                            <Text
                                type="secondary"
                                style={{
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {p?.role}
                            </Text>

                            <Button
                                size="small"
                                onClick={() =>
                                    toggleAdminRole(p?._id)
                                }
                            >
                                Toggle role
                            </Button>
                        </Flex>
                    </Flex>

                </Flex>
            )
        }
    ];

    const columns = screens.xs
        ? mobileColumns
        : desktopColumns;

    // [CAMBIO] NUEVO: ancho de los selectores (a lo ancho en móvil)
    const selectStyle = { width: screens.xs ? "100%" : 160 };

    return (
        <>
            <Flex
                gap={12}
                wrap="wrap"
                align="center"
                style={{ marginBottom: 12 }}
            >
                <Input.Search
                    placeholder="Search for a player by name and lastname"
                    allowClear
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    style={{
                        maxWidth: 320,
                        width: "100%"
                    }}
                />

                <ExportToExcel
                    data={playersWithCountry}
                    fileName="players.xlsx"
                />
            </Flex>

            {/* [CAMBIO] NUEVO: barra de filtros (fuera de la tabla para que también funcione
                en móvil, donde la cabecera de la tabla está oculta) */}
            <Flex
                gap={8}
                wrap="wrap"
                align="center"
                vertical={screens.xs}
                style={{ marginBottom: 12 }}
            >
                <Select
                    value={filters.ranking}
                    onChange={updateFilter("ranking")}
                    options={RANKING_OPTIONS}
                    style={selectStyle}
                    aria-label="Filter by ranking"
                />
                <Select
                    value={filters.status}
                    onChange={updateFilter("status")}
                    options={STATUS_OPTIONS}
                    style={selectStyle}
                    aria-label="Filter by account status"
                />
                <Select
                    value={filters.role}
                    onChange={updateFilter("role")}
                    options={ROLE_OPTIONS}
                    style={selectStyle}
                    aria-label="Filter by role"
                />
                <Select
                    value={filters.verification}
                    onChange={updateFilter("verification")}
                    options={VERIFICATION_OPTIONS}
                    style={selectStyle}
                    aria-label="Filter by email verification"
                />
                <Button
                    icon={<ClearOutlined />}
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    block={screens.xs}
                >
                    Clear filters
                </Button>
            </Flex>

            {/* Table header / refresh */}
            <Flex
                justify="space-between"
                align="center"
                style={{
                    width: "100%",
                    marginBottom: 8,
                }}
            >
                <Text
                    type="secondary"
                    style={{
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                >
                    {/* [CAMBIO] antes solo "Players". Ahora con contador de filtrados e inscritos */}
                    {loading
                        ? "Players"
                        : `Showing ${filteredPlayers.length} of ${players.length} players · ${rankedCount} ranked`}
                </Text>

                <Tooltip title="Refresh players">
                    <Button
                        type="text"
                        size="small"
                        icon={
                            <ReloadOutlined spin={loading} />
                        }
                        loading={loading}
                        onClick={fetchPlayers}
                        aria-label="Refresh players"
                    />
                </Tooltip>
            </Flex>

            <Table
                dataSource={filteredPlayers}
                columns={columns}
                loading={loading}
                rowKey="_id"
                scroll={
                    screens.xs
                        ? undefined
                        : { x: "max-content" }
                }
                showHeader={!screens.xs}
                tableLayout={
                    screens.xs ? "fixed" : "auto"
                }
            />

            <NTRPModal
                player={selectedPlayer}
                openModal={!!selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
                fetchPlayers={fetchPlayers}
            />
        </>
    );
};

export default PlayersTable;