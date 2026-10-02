import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Row, Typography } from "antd"
import { CheckCircleOutlined, CloseCircleFilled, TrophyOutlined } from "@ant-design/icons"
import colors from "../../themes/colors";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import LoadingSpinner from "../utils/LoadingSpinner";
import RankingSummary from "./RankingSummary";
import { registerRank } from "../../actions/ranking";
import { toast } from "react-toastify";



const MIN_AGE = 18;
const DATE_FORMAT = "DD/MM/YYYY";
const isAdult = (date) => !!date && dayjs(date).isValid() && dayjs().diff(dayjs(date), "year") >= MIN_AGE;
const { Text } = Typography;

//console.log(user)

const RequirementRow = ({ ok, label, hint }) => (
    <div
        style={{
            display: "flex",
            gap: 10,
            alignItems: 'flex-start',
            marginBottom: 10
        }}
    >
        {ok ? (
            <CheckCircleOutlined style={{ color: colors.success, fontSize: 18, marginTop: 2 }} />
        ) : (
            <CloseCircleFilled style={{ color: colors.danger, fontSize: 18, marginTop: 2 }} />
        )
        }
        <div>
            <Text strong>
                {label}
            </Text>
            {
                !ok && hint && (
                    <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {hint}
                        </Text>
                    </div>
                )
            }
        </div>
    </div>
)

const RankRegisterForm = ({ user, loading, loadUser, isMobile }) => {


    const hasStoredDob = !!user?.dateOfBirth;

    const [form] = Form.useForm();
    const [loadSubmit, setLoadSubmit] = useState(false);

    const acceptRules = Form.useWatch("acceptRankingRules", form)

    const inputDob = Form.useWatch("dateOfBirth", form)

    const requirements = useMemo(() => {
        const suspended = !!user?.suspendedUntil && dayjs(user?.suspendedUntil).isAfter(dayjs());
        const dobToCheck = hasStoredDob ? user?.dateOfBirth : inputDob;

        return {
            verified: !!user?.isVerified,
            hasNTRP: !!user?.ntrplvl,
            notSuspended: !suspended,
            suspendedUntil: suspended ? dayjs(user?.suspendedUntil).format(DATE_FORMAT) : null,

            //AGE verification
            ageOk: isAdult(dobToCheck),
            dobMissing: !hasStoredDob && !inputDob,
            storedUnderage: hasStoredDob && !isAdult(user?.dateOfBirth),

        }
    }, [user, hasStoredDob, inputDob]);

    const formBlocked =
        !requirements.verified ||
        !requirements.hasNTRP ||
        !requirements.notSuspended ||
        requirements.storedUnderage;

    const canRegister = !formBlocked && requirements.ageOk;



    const handleRegister = async(values) => {
        try {
            setLoadSubmit(true)

            const res = await registerRank(values)

            toast.success(res?.data?.message || 'Successful registration. Welcome to the ranking')

            loadUser();
            
        } catch (error) {
            toast.error('There was an error with your registration')
            setLoadSubmit(false)
        }finally{
            setLoadSubmit(false)
        }
    }


    if (loading || !user) return <LoadingSpinner />

    const ageHint = requirements.storedUnderage
        ? `The ranking is only available to players ${MIN_AGE} or over`
        : requirements.dobMissing ?
            "Enter your date of birth in the form"
            : `You must be ${MIN_AGE} years old to participate`


    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card
                        title="Requirements "
                    >
                        <RequirementRow
                            ok={requirements.verified}
                            label="Verfied account"
                            hint="Please verify your email address first (See notice on top of page)"
                        />
                        <RequirementRow
                            ok={requirements.hasNTRP}
                            label="You need an NTRP to join"
                            hint="You need an NTRP level to join ranking. Please complete your profile or contact an admin"
                        />
                        <RequirementRow
                            ok={requirements.notSuspended}
                            label="No active suspension"
                            hint={
                                requirements.suspendedUntil ?
                                    `You are suspended until ${requirements.suspendedUntil}`
                                    :
                                    undefined
                            }
                        />
                        <RequirementRow
                            ok={requirements.ageOk}
                            label={`${MIN_AGE} years or older`}
                            hint={ageHint}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        title="Join the ranking"
                    >
                        <RankingSummary />

                        {/* FORM  */}

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleRegister}
                            style={{ marginTop: 20 }}
                            disabled={loadSubmit}
                            requiredMark={false}
                        >
                            {
                                !hasStoredDob && (
                                    <Form.Item
                                        name="dateOfBirth"
                                        label="Date of birth"
                                        extra="Used only to confirm you are 18 or older. It cannot be changed later, so please make sure it is correct"
                                        rules={[
                                            { required: true, message: "Please enter your date of birth" },
                                            {
                                                validator: (_, value) =>
                                                    !value || isAdult(value)
                                                        ? Promise.resolve()
                                                        : Promise.reject(
                                                            new Error(`You must be ${MIN_AGE}+ years old to participate`)
                                                        ),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format={DATE_FORMAT}
                                            style={{ width: '100%' }}
                                            placeholder="DD/MM/YYYY"
                                            inputReadOnly={isMobile}
                                            defaultPickerValue={dayjs().subtract(30, "year")}
                                            disabledDate={(current) => current && (current.isAfter(dayjs(), "day")
                                                ||
                                                current.isBefore(dayjs("1900-01-01"))
                                            )}
                                        />
                                    </Form.Item>
                                )
                            }

                            <Form.Item
                                name="acceptRankingRules"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) => 
                                            value === true ? Promise.resolve() : Promise.reject(new Error("You must accept the MTC Ranking rules to register"))
                                        ,
                                        
                                    },
                                    
                                ]}
                            >
                                <Checkbox>
                                    I have read I accept the MTC Ranking rules
                                </Checkbox>
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                block={isMobile}
                                loading={loadSubmit}
                                disabled={!canRegister || !acceptRules}
                                icon={<TrophyOutlined />}
                            >
                                Register for the ranking
                            </Button>

                            {
                                formBlocked && (
                                    <Alert
                                        style={{ marginTop: 16 }}
                                        type="warning"
                                        showIcon
                                        title="You do not meet all the requirements yet"
                                        description="Check the requirements list"
                                    />
                                )
                            }
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default RankRegisterForm