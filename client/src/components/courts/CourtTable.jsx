import {
    Card,
    Col,
    Popconfirm,
    Row,
    Statistic,
    Table,
    Tooltip,
} from "antd";
import {
    CheckSquareOutlined,
    CloseOutlined,
    EnvironmentOutlined,
    PlaySquareOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import { activateLocations, favoriteLocation } from "../../actions";
import { toast } from "react-toastify";
import StatsCard from "../common/StatsCard";
import { useState } from "react";
import CourtModalSurface from "../modals/CourtModalSurface";
import { getLocation, updateSurface } from "../../actions/location";

const CourtTable = ({ courts, loadCourts, onRefresh }) => {
    const maxCourtNumber = (courts = []) => {
        if (!courts.length) return 0;
        return Math.max(...courts.map((c) => c.number));
    };

    const [openModal, setOpenModal] = useState(false);
    const [court, setCourt] = useState(null)

    const totalCourts = courts.reduce(
        (acc, loc) => acc + maxCourtNumber(loc.courts),
        0
    );

    const handleToggleFavorite = async (slug) => {
        try {
            const res = await favoriteLocation(slug);
            toast.info(
                `${res?.location?.name} has been ${res.favorite ? "added to" : "removed from"
                } favorites`
            );
            onRefresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleActivate = async (slug) => {
        try {
            const res = await activateLocations(slug);
            toast.info(
                `${res?.location?.name} has been ${res.active ? "de-activated" : "activated"
                }`
            );
            onRefresh();
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    const getCourt = async(slug) => {
        try {
            
            setOpenModal(true)

            const res = await getLocation(slug)
            setCourt(res);            
            
        } catch (error) {
            console.log(error)
            setOpenModal(false)
        }
    }

    const handleSurfaceUpdate = async(slug, surface, courtNumber) => {
        try {
    
            const res = await updateSurface(slug, courtNumber, surface);
            
            toast.success(`Court updated successfully for ${res?.name}`);
            setOpenModal(false)
            
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Error updating court surface')
            setOpenModal(false)
        }
    }

    const columns = [
        {
            title: "Location",
            dataIndex: "name",
            width: 180,
        },
        {
            title: "Address",
            dataIndex: "address",
            responsive: ["md"], // 👈 se oculta en móvil
        },
        {
            title: "# Courts",
            dataIndex: "courts",
            width: 90,
            render: (c) => maxCourtNumber(c),
        },
        {
            title: "Fav",
            align: "center",
            width: 70,
            render: (_, record) => (
                <Tooltip
                    title={
                        record.favorite ? "Remove favorite" : "Add favorite"
                    }
                >
                    <span
                        style={{ cursor: "pointer", fontSize: 18 }}
                        onClick={() =>
                            handleToggleFavorite(record?.slug)
                        }
                    >
                        {record.favorite ? (
                            <StarFilled style={{ color: "#deeb2c" }} />
                        ) : (
                            <StarOutlined style={{ color: "#deeb2c" }} />
                        )}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Active",
            align: "center",
            width: 80,
            render: (record) => (
                <Tooltip
                    title={
                        record?.active
                            ? "De-activate location"
                            : "Activate location"
                    }
                >
                    <Popconfirm
                        title={`Are you sure you wish to ${record?.active ? "de-activate" : "activate"
                            } this location`}
                        onConfirm={() =>
                            handleToggleActivate(record?.slug)
                        }
                    >
                        <span style={{ cursor: "pointer", fontSize: 18 }}>
                            {record.active ? (
                                <CheckSquareOutlined
                                    style={{ color: "#46AF50" }}
                                />
                            ) : (

                                <CloseOutlined style={{ color: "#B6491A" }} />
                            )}
                        </span>
                    </Popconfirm>
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <Card title="Locations" style={{ width: "100%" }}>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12}>
                        <StatsCard icon={<EnvironmentOutlined />}>
                            <Statistic title="Locations" value={courts.length} />
                        </StatsCard>
                    </Col>

                    <Col xs={24} sm={12}>
                        <StatsCard icon={<PlaySquareOutlined />}>
                            <Statistic title="Total Courts" value={totalCourts} />
                        </StatsCard>
                    </Col>
                </Row>

                <Table
                    dataSource={courts}
                    columns={columns}
                    pagination={{ pageSize: 6 }}
                    rowKey="_id"
                    size="small"
                    loading={loadCourts}
                    scroll={{ x: "max-content" }}  // 👈 CLAVE MOBILE
                    onRow={(record) => ({
                        onDoubleClick: () => {
                            if(!record.active){
                                toast.warning('Location must be active to edit court surface');
                                return;
                            }
                            getCourt(record.slug) 
                        },
                        style:{
                            cursor: record.active ? "pointer" : "not-allowed",
                            opacity: record.active ? 1 : 0.5
                        }
                    })}
                />
            </Card>

            <CourtModalSurface 
                open={openModal}
                court={court}
                onClose={() => setOpenModal(false)}
                updateSurface={handleSurfaceUpdate}
            />
        </>
    );
};

export default CourtTable;
