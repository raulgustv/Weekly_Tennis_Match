import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'
import axiosInstance from "../../API/axios";
import { Result, Statistic, Card, Button, Spin, Typography } from "antd";
import { useMatches } from "../../context/MatchContext";
import { useAuth } from "../../context/AuthContext";

const { Text } = Typography;

const MatchInviteAccept = () => {

  const { Timer } = Statistic;

  const { fetchMatches } = useMatches()

  const { user, loadUser } = useAuth()

  const [price, setPrice] = useState(null)
  // 🔵 CAMBIO: ya no se pide método de pago aquí con un PaymentModal — el
  // backend usa el que el backup ya eligió al apuntarse (ver
  // server/controller/match.js, acceptInvite, y PATCH_backup_payment_hold.md).
  // Este estado es solo para MOSTRARLO de forma informativa si el endpoint
  // de vista de partido nos devuelve nuestra propia entrada en backUps; si
  // no la devuelve, simplemente no se muestra el método y el flujo sigue
  // igual (no es bloqueante).
  const [paymentMethodLabel, setPaymentMethodLabel] = useState(null);
  const [ready, setReady] = useState(false);
  const [confirming, setConfirming] = useState(false);
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
        setPrice(pricePerPlayer);

        // 🔵 CAMBIO (nuevo): busca la propia entrada en backUps para mostrar
        // qué método de pago se eligió al apuntarse como backup. Best-effort:
        // si este endpoint no popula/incluye backUps.user tal cual, no pasa
        // nada, solo se omite el texto informativo.
        const ownBackup = data?.backUps?.find((b) => {
          const backupUserId = b?.user?._id || b?.user;
          return backupUserId && user?._id && String(backupUserId) === String(user._id);
        });

        setPaymentMethodLabel(ownBackup?.payment?.method || null);

        setReady(true);

      } catch (error) {
        toast.error("Match not found");
        navigate("/dashboard");
      }
    };

    fetchMatch();

  }, [token, matchId, navigate, user]);

  // 🔵 CAMBIO: handleConfirm ya no recibe paymentMethod ni lo manda en el
  // body — antes venía de PaymentModal.onConfirm(paymentMethod). Ahora es
  // un simple botón de confirmación.
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await axiosInstance.post(`/match/invite/accept?token=${token}`, {});

      await fetchMatches();

      setSuccess(true)
      loadUser();

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Error accepting invitation')
      navigate("/games")
    } finally {
      setConfirming(false);
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

  // 🔵 CAMBIO (nuevo): estado de carga mientras se obtiene el partido, antes
  // no hacía falta porque el PaymentModal ya se abría/cerraba con su propio
  // prop `open`.
  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <Spin />
      </div>
    );
  }

  // 🔵 CAMBIO: sustituye al <PaymentModal> — ya no se pide método de pago,
  // solo se confirma que se quiere ocupar la plaza con el método ya elegido
  // como backup.
  return (
    <Card
      title="You've been invited to join this match"
      style={{ maxWidth: 420, margin: "60px auto" }}
    >
      <Text>
        A spot opened up and it's your turn as backup.
        {price ? ` The price is €${price} per player.` : ""}
        {paymentMethodLabel
          ? ` You'll be charged using the payment method you selected when you joined as backup (${paymentMethodLabel}).`
          : " You'll be charged using the payment method you selected when you joined as backup."}
      </Text>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Button type="primary" block loading={confirming} onClick={handleConfirm}>
          Confirm and join
        </Button>
        <Button block disabled={confirming} onClick={() => navigate('/games')}>
          Not now
        </Button>
      </div>
    </Card>
  )
}

export default MatchInviteAccept