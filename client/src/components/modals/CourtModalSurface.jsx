import { Flex, Modal, Select, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import { surfaceColors } from '../../themes/surfaceColors';
import { StarFilled, StarOutlined } from "@ant-design/icons"
import { toggleFavoriteCourt } from '../../actions/location';


const CourtModalSurface = ({ open, onClose, court, updateSurface }) => {

    // Guarda los cambios pendientes por cancha: { [courtNumber]: nuevaSuperficie }
    const [changes, setChanges] = useState({});
    // Guarda los favoritos ya actualizados: { [courtNumber]: boolean }
    const [favoriteOverrides, setFavoriteOverrides] = useState({});

    const surfaces = ['Quick', 'Hard', 'Clay', 'Grass'];

    const handleChange = (cn, val) => {
        setChanges(prev => ({ ...prev, [cn]: val }));
    }

    const handleOk = () => {
        if (Object.keys(changes).length === 0) {
            onClose();
            return;
        }

        Object.entries(changes).forEach(([courtNumber, val]) => {
            updateSurface(court?.slug, val, Number(courtNumber));
        });

        setChanges({});
        onClose();
    }

    const handleCancel = () => {
        setChanges({});
        onClose();
    }

    const handleToggleCourtFavorite = async (slug, courtNumber, currentFavorite) => {
        try {
            await toggleFavoriteCourt(slug, courtNumber)
            setFavoriteOverrides(prev => ({ ...prev, [courtNumber]: !currentFavorite }));
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            onOk={handleOk}
            title={court?.name}
        >
            {court?.courts?.map((cn) => {
                const currentSurface = changes[cn?.number] ?? cn?.surface;
                const isFavorite = favoriteOverrides[cn?.number] ?? cn?.favorite;

                return (
                    <div key={cn?.number}>
                        <Flex
                            justify='flex-start'
                            align='center'
                            gap={12}
                        >
                            <Tag color={surfaceColors[currentSurface]}>
                                Court: {cn?.number}
                            </Tag>

                            <Select
                                value={currentSurface}
                                style={{ width: '50%', marginBottom: 10 }}
                                options={surfaces.map((s) => ({
                                    value: s,
                                    label: s
                                }))}
                                onChange={(val) => handleChange(cn?.number, val)}
                            />

                            <Tooltip
                                title={isFavorite ? "Remove favorite" : "Add favorite"}
                            >
                                <span
                                    style={{ cursor: "pointer", fontSize: 18 }}
                                    onClick={() => handleToggleCourtFavorite(court?.slug, cn?.number, isFavorite)}
                                >
                                    {isFavorite ? (
                                        <StarFilled style={{ color: "#deeb2c" }} />
                                    ) : (
                                        <StarOutlined style={{ color: "#deeb2c" }} />
                                    )}
                                </span>
                            </Tooltip>

                        </Flex>
                    </div>
                );
            })}
        </Modal>
    )
}

export default CourtModalSurface