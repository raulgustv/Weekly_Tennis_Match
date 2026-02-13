import { Result, Statistic } from "antd";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../API/axios";
import { useMatches } from "../../context/MatchContext";


const MatchDeclineInvite = () => {

    const { Timer } = Statistic;

    const hasRun = useRef(false);

    const {fetchMatches} = useMatches();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');     

    const deadline = Date.now() + 3000

    useEffect(() =>{
        if(hasRun.current) return;

        hasRun.current = true;

        if(!token){
            toast.error('Token has not been provided')
            navigate('/dashboard')
            return;
        }

        const declineInvite = async() =>{
            try {
                await axiosInstance.get(`/match/invite/decline?token=${token}`)


                

                toast.info('Invitation declined')

                setTimeout(() => {
                    navigate('/dashboard')
                }, 3000);

                fetchMatches()
            } catch (error) {   
                toast.error(error?.response?.data?.message || 'Error declining invitation')
                navigate('/dashboard')
            }
        }

        declineInvite()
    }, [token, navigate, fetchMatches])

    return (
        <Result
            title="You have declined the match"
            subTitle={
                <div>
                    You will be placed last in backup queue
                    <Timer
                        type="countdown"
                        format="s"
                        value={deadline}
                    />
                </div>
            }
        />
    )
}

export default MatchDeclineInvite