import { Col, Divider, Row, Skeleton } from "antd";
import { useAuth } from "../../context"
//import colors from "../../themes/colors";
import { useCountries } from "../../hooks/useCountries";
import { useMemo } from "react";
import { useNTRPAdjustment } from "../../hooks/useNTRPAdjustment";
import { resetPasswordEmail } from "../../actions/auth";
import { toast } from 'react-toastify'
import useCountdown from "../../hooks/useCountdown";
import PersonalInfo from "../../components/profile/PersonalInfo";
import NTRPHistory from "../../components/profile/NTRPHistory";
import ProfileHeader from "../../components/profile/ProfileHeader";



const UserProfile = () => {

    const { user } = useAuth();

    console.log(user.role)

    const { countries } = useCountries();

    const total_cooldown = 120000

    const resetCooldown = useCountdown({
        duration: total_cooldown
    })


    const ntrpHistory = useNTRPAdjustment(user?.adjustmentHistory);

    const isLoading = !user || !countries || !ntrpHistory

    const countryFlag = useMemo(() => {
        if (!user?.country || !countries?.length) return null;

        return (
            countries.find(
                c => c.name?.toLowerCase() === user.country.toLowerCase()
            )?.flag || null
        );
    }, [user?.country, countries]);


    if (!user) return null;

    const handleSendReset = async (email) => {
        try {

            await resetPasswordEmail(email)

            toast.success(`Email sent to ${email}`)

            resetCooldown.start();

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

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

            <ProfileHeader user={user} editable={true} />

            <Divider />

            {/* ================= PERSONAL INFO ================= */}

            <PersonalInfo user={user} countryFlag={countryFlag} handleSendReset={handleSendReset} passwordChange={true} />

            {/* ================= NTRP HISTORY ================= */}

            <Divider />
            
            <NTRPHistory ntrpHistory={ntrpHistory} />

        </>
    );

}

export default UserProfile