import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'
import axiosInstance from "../../API/axios";
import { Result, Statistic } from "antd";
import { useMatches } from "../../context/MatchContext";

const MatchInviteAccept = () => {

  const { Timer } = Statistic;

  const {fetchMatches} = useMatches() 


  const hasRun = useRef(false)

  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  const token = searchParams.get('token');

  const deadline = Date.now() + 3000

  useEffect(() => {

    if (hasRun.current) return
    hasRun.current = true;

    if (!token) {
      toast.error('Token not provided')
      navigate('/dashboard');
      return;
    }

    const acceptInvite = async () => {
      try {
        await axiosInstance.get(`/match/invite/accept?token=${token}`)

        fetchMatches()
      
      } catch (error) {
        toast.error(error.response.data.message)
        navigate('/dashboard')
      }
    }

    acceptInvite();

  }, [token, navigate, fetchMatches]);





  return (
    <Result
      status="success"
      title="Successfully joined match"
      subTitle={
        <div>
          Redirecting in {" "}
          <Timer
            type="countdown"
            format="s"
            value={deadline}
            onFinish={() => navigate(`match/details/${matchId}`)}
          /> {" "}
          seconds...
        </div>
      }

    />
  )
}

export default MatchInviteAccept