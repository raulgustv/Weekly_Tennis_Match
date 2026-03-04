import { Button, Checkbox, Flex, Image, Popconfirm, Table, Typography, Grid } from "antd"
import { useCountries } from "../../hooks/useCountries";
import { useMemo, useState } from "react";
import { togglePlayerActive, toggleUserRole } from "../../actions/admin";
import { toast } from "react-toastify";
import NTRPModal from "../../components/modals/NTRPModal";
import ProfilePicture from "../../components/uploads/ProfilePicture";
//import { useAuth } from "../../context/AuthContext";


const PlayersTable = ({ players, loading, fetchPlayers }) => {

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint()

    const { countries } = useCountries();

    const [selectedPlayer, setSelectedPlayer] = useState(null)

    const { Text } = Typography;



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

            if (!user) return toast.error('User was not found')

            toast.success(`${user?.name} ${user?.lastname} has been ${active ? 'activated' : 'de-activated'}`);

            fetchPlayers();

        } catch (error) {
            console.log(error)
        }
    }

    const toggleAdminRole = async (id) => {
        try {

            const res = await toggleUserRole(id);

            toast.success(`User successfully changed role to ${res?.user?.role}`)

            fetchPlayers()

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    }

    const columns = [
        {
            title: "Player name",
            key: "name",
            render: ((p) => (
                <Flex align="center" justify="space-between" gap={8}>

                    <Flex
                        align="center"
                        style={{
                            minWidth: 0, // 🔥 MUY IMPORTANTE para que ellipsis funcione
                            overflow: "hidden"
                        }}
                    >
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

                    <ProfilePicture
                        profilePicture={p?.profilePicture?.url}
                        user={p}
                        size={28}
                        editable={false}
                    />

                </Flex>
            )),
            filters: players.map((p) => ({
                text: `${p?.name} ${p.lastname}`,
                value: `${p?.name} ${p.lastname}`
            })),
            filterSearch: true,
            onFilter: (value, record) => {
                const fullName = `${record?.name} ${record?.lastname}`.toLowerCase();
                return fullName.startsWith(value.toLowerCase());
            },
            sorter: (a, b) => {
                const nameA = `${a?.name} ${a?.lastname}`.toLowerCase();
                const nameB = `${b?.name} ${b?.lastname}`.toLowerCase();
                return nameA.localeCompare(nameB);
            },
            sortDirections: ["ascend", "descend"], // opcional pero recomendado
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
            render: ((p) => (
                <Flex justify="space-between" align="center" gap="small" vertical={screens.xs ? true : false}>
                    <span>{p?.country}</span>
                    <Image preview={false} width={screens.xs ? 18 : 25} alt={`${p?.country} flag`} src={p?.countryFlag} />
                </Flex>
            ))
        },
        {
            title: "NTRP Level",
            key: "ntrplvl",
            render: ((p) => (
                <Flex justify="center" align="center" gap="middle" vertical={screens.xs ? true : false}>
                    <span>{p?.ntrplvl.toFixed(1)}</span>
                    <Button size="small" type="primary" onClick={() => setSelectedPlayer(p)} block >
                        Adjust
                    </Button>
                </Flex>
            ))
        },
        {
            title: "Active",
            key: "active",
            render: ((p) => (
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
            ))
        },
        {
            title: 'Role',
            key: 'role',
            render: ((p) => (
                <>
                    <Flex
                        direction={screens.xs ? "column" : "row"}
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

                </>
            ))
        }
    ]

    return (
        <>
            <Table
                dataSource={playersWithCountry}
                columns={columns}
                loading={loading}
                rowKey="_id"
                scroll={{ x: "max-content" }}
            />


            <NTRPModal player={selectedPlayer} openModal={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} fetchPlayers={fetchPlayers} />
        </>
    )
}

export default PlayersTable