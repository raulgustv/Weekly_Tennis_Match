import {
    Button,
    Checkbox,
    Flex,
    Image,
    Input,
    Popconfirm,
    Table,
    Typography,
    Grid,
    Tooltip
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useCountries } from "../../hooks/useCountries";
import { useMemo, useState } from "react";
import { togglePlayerActive, toggleUserRole } from "../../actions/admin";
import { toast } from "react-toastify";
import NTRPModal from "../../components/modals/NTRPModal";
import ProfilePicture from "../../components/uploads/ProfilePicture";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "../../components/common/ExportExcel";

const PlayersTable = ({ players, loading, fetchPlayers }) => {

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const { countries } = useCountries();

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
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

    // Filtro de búsqueda por nombre y apellido
    const filteredPlayers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return playersWithCountry;

        return playersWithCountry.filter((p) =>
            `${p?.name ?? ""} ${p?.lastname ?? ""}`
                .toLowerCase()
                .includes(term)
        );
    }, [playersWithCountry, searchTerm]);

    const toggleActivation = async (id) => {
        try {
            const res = await togglePlayerActive(id);
            const { user, active } = res;

            if (!user) return toast.error("User was not found");

            toast.success(
                `${user?.name} ${user?.lastname} has been ${
                    active ? "activated" : "de-activated"
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
                        </Flex>
                    </Tooltip>

                    <Button
                        type="text"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/player/${p._id}`);
                        }}
                    >
                        View
                    </Button>
                </Flex>
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
                    <span>{p?.ntrplvl.toFixed(1)}</span>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => setSelectedPlayer(p)}
                    >
                        Adjust
                    </Button>
                </Flex>
            )
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
                                NTRP {p?.ntrplvl.toFixed(1)}
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

    return (
        <>
            <Flex
                gap={12}
                wrap="wrap"
                align="center"
                style={{ marginBottom: 12 }}
            >
                <Input.Search
                    placeholder="Buscar jugador por nombre o apellido"
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
                    Players
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