import { Button, Col, Divider, Flex, Row, Skeleton } from "antd";
import { useAuth } from "../../context"
//import colors from "../../themes/colors";
import { useEffect, useState } from "react";
import { useNTRPAdjustment } from "../../hooks/useNTRPAdjustment";
import PersonalInfo from "../../components/profile/PersonalInfo";
import NTRPHistory from "../../components/profile/NTRPHistory";
import { useNavigate, useParams } from "react-router-dom";
import { viewPlayer } from "../../actions/admin";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { toast } from "react-toastify";
import UserNotes from "../../components/profile/UserNotes";
import { ArrowLeftOutlined } from "@ant-design/icons";



const ProfileViewAdmin = () => {

    const { id } = useParams();

    const { user } = useAuth();

    const [player, setPlayer] = useState(null)

    const navigate = useNavigate()

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

    //suspension
    const isSuspended =
    player?.suspendedUntil &&
    new Date(player.suspendedUntil) > new Date();
  

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

            <Flex justify="flex-end" style={{ marginBottom: 12 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="default"
                    onClick={() => { navigate('/admin/players') }}
                >
                    Back to players table
                </Button>
            </Flex>

            <ProfileHeader user={player} editable={false} />

            <Divider />

            {/* ================= PERSONAL INFO ================= */}

            <PersonalInfo user={player} passwordChange={false} addFundsButton={true} />

            {/* ================= NTRP HISTORY ================= */}

            <Divider />

            <Row>
                <Col xs={24} md={12} lg={12}>
                    <NTRPHistory ntrpHistory={ntrpHistory} />
                </Col>

                <Col xs={24} md={12} lg={12}>
                    <UserNotes userId={id} isSuspended={isSuspended} />
                </Col>


            </Row>








        </>
    );

}

export default ProfileViewAdmin
