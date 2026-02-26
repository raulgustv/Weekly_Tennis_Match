import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'
import axiosInstance from "../../API/axios";
import { Result, Statistic } from "antd";
import { useMatches } from "../../context/MatchContext";
import PaymentModal from "./PaymentModal";

const MatchInviteAccept = () => {

  const { Timer } = Statistic;

  const { fetchMatches } = useMatches()

  const [paymentMethod, setPaymentMethod] = useState([])
  const [price, setPrice] = useState(null)
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [success, setSuccess] = useState(false)


  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  const token = searchParams.get('token');

  const deadline = Date.now() + 3000

  useEffect(() => {
    if (!token) {
      toast.error("Token not provided");
      navigate("/dashboard");
      return;
    }

    const fetchMatch = async () => {
      try {
        const { data } = await axiosInstance.get(`/match/view-match/${matchId}`);

        const pricePerPlayer = (data?.price / data?.maxPlayers).toFixed(2)

        setPaymentMethod(data?.paymentMethods);
        setPrice(pricePerPlayer);

        setOpenPaymentModal(true);

      } catch (error) {
        toast.error("Match not found");
        navigate("/dashboard");
      } 
    };

    fetchMatch();

  }, [token, matchId, navigate]);

  const handleConfirm = async (paymentMethod) => {
    try {
      await axiosInstance.post(`/match/invite/accept?token=${token}`, { paymentMethod });

      await fetchMatches();

      setOpenPaymentModal(false);
      setSuccess(true)

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Error accepting invitation')
      navigate("/games")
    }
  }


  if (success) {
    return (
      <Result
        status="success"
        title="Successfully joined match"
        subTitle={
          <div>
            Redirecting in{" "}
            <Timer
              type="countdown"
              format="s"
              value={deadline}
              onFinish={() => navigate(`/match/details/${matchId}`)}
            />{" "}
            seconds...
          </div>
        }
      />
    );
  }



  return (
    <PaymentModal
      open={openPaymentModal}
      onCancel={() => navigate('/games')}
      onConfirm={handleConfirm}
      paymentMethods={paymentMethod}
      price={price}
    />
  )
}

export default MatchInviteAccept