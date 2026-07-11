import {
    Button,
    Checkbox,
    Flex,
    Image,
    Popconfirm,
    Table,
    Typography,
    Grid,
    Tooltip
} from "antd";
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

    const toggleActivation = async (id) => {
        try {
            const res = await togglePlayerActive(id);
            const { user, active } = res;

            if (!user) return toast.error('User was not found');

            toast.success(`${user?.name} ${user?.lastname} has been ${active ? 'activated' : 'de-activated'}`);
            fetchPlayers();

        } catch (error) {
            console.log(error);
        }
    };

    const toggleAdminRole = async (id) => {
        try {
            const res = await toggleUserRole(id);
            toast.success(`User successfully changed role to ${res?.user?.role}`);
            fetchPlayers();
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    const columns = [
        {
            title: "Player name",
            key: "name",
            render: (p) => (
                <Flex
                    vertical={screens.xs} // 🔥 clave mobile
                    align={screens.xs ? "stretch" : "center"}
                    justify="space-between"
                    gap={8}
                    style={{ width: "100%" }}
                >
                    {/* LEFT SIDE */}
                    <Tooltip title="Click on player to view profile">
                        <Flex
                            align="center"
                            gap={8}
                            style={{
                                minWidth: 0,
                                overflow: "hidden",
                                flex: screens.xs ? "unset" : 1,
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
                                    whiteSpace: screens.xs ? "normal" : "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {p?.name} {p?.lastname}
                            </span>
                        </Flex>
                    </Tooltip>

                    {/* RIGHT SIDE */}
                    <Button
                        type={screens.xs ? "primary" : "text"}
                        size="small"
                        block={screens.xs}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/player/${p._id}`);
                        }}
                    >
                        {screens.xs ? "View profile" : "View"}
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
                const nameA = `${a?.name} ${a?.lastname}`.toLowerCase();
                const nameB = `${b?.name} ${b?.lastname}`.toLowerCase();
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
                <Flex
                    justify="space-between"
                    align="center"
                    gap="small"
                    vertical={screens.xs}
                >
                    <span>{p?.country}</span>
                    <Image
                        preview={false}
                        width={screens.xs ? 18 : 25}
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
                <Flex
                    justify="center"
                    align="center"
                    gap="middle"
                    vertical={screens.xs}
                >
                    <span>{p?.ntrplvl.toFixed(1)}</span>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => setSelectedPlayer(p)}
                        block={screens.xs}
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
                    title={p?.isActive ? "Deactivate player?" : 'Activate player?'}
                    description={p?.isActive ? "This player will no longer be active" : "This player will be activated"}
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
            title: 'Role',
            key: 'role',
            render: (p) => (
                <Flex
                    vertical={screens.xs}
                    align="center"
                    gap="small"
                    style={{ width: "100%" }}
                >
                    <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                        {p?.role}
                    </Text>

                    <Button
                        size="small"
                        type="primary"
                        onClick={() => toggleAdminRole(p?._id)}
                        block={screens.xs}
                    >
                        Toggle role
                    </Button>
                </Flex>
            )
        }
    ];

    return (
        <>

            <Flex gap={4}>
                <ExportToExcel
                    data={playersWithCountry}
                    fileName="players.xlsx"
                />
            </Flex>

            <Table
                dataSource={playersWithCountry}
                columns={columns}
                loading={loading}
                rowKey="_id"
                scroll={{ x: "max-content" }}
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