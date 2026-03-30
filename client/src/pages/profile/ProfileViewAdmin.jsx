import { Col, Divider, Row, Skeleton } from "antd";
import { useAuth } from "../../context"
//import colors from "../../themes/colors";
import { useEffect, useState } from "react";
import { useNTRPAdjustment } from "../../hooks/useNTRPAdjustment";
import PersonalInfo from "../../components/profile/PersonalInfo";
import NTRPHistory from "../../components/profile/NTRPHistory";
import { useParams } from "react-router-dom";
import { viewPlayer } from "../../actions/admin";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { toast } from "react-toastify";



const ProfileViewAdmin = () => {

    const { id } = useParams();

    const { user } = useAuth();

    const [player, setPlayer] = useState(null)

    useEffect(() => {
        const getPlayer = async () => {
            try {
                const res = await viewPlayer(id)

                setPlayer(res)
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Error obtaining player data')
            }
        }

        getPlayer()
    }, [id])


    const ntrpHistory = useNTRPAdjustment(player?.adjustmentHistory);

    const isLoading = !user || !ntrpHistory


    if (!user) return null;

    if (isLoading) {
        return (
            <>
                {/* Header skeleton */}
                <Row align="middle" gutter={24}>
                    <Col>
                        <Skeleton.Avatar active size={96} />
                    </Col>
                    <Col flex="auto">
                        <Skeleton.Input active style={{ width: 220 }} />
                        <Skeleton.Input
                            active
                            style={{ width: 160, marginTop: 8 }}
                        />
                    </Col>
                </Row>

                <Divider />

                {/* Personal info skeleton */}
                <Skeleton active paragraph={{ rows: 4 }} />

                <Divider />

                {/* Timeline skeleton */}
                <Skeleton active paragraph={{ rows: 3 }} />
            </>
        );
    }
    return (
        <>
            {/* ================= HEADER ================= */}

            <ProfileHeader user={player} editable={false} />

            <Divider />

            {/* ================= PERSONAL INFO ================= */}

            <PersonalInfo user={player} passwordChange={false}  />

            {/* ================= NTRP HISTORY ================= */}

            <Divider />

            <NTRPHistory ntrpHistory={ntrpHistory}  />

        </>
    );

}

export default ProfileViewAdmin
