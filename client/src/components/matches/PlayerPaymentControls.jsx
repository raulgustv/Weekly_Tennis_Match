// 🔵 NUEVO (archivo completo): controles de pago de UN jugador.
// Sustituye al <Tag> + <Switch> que antes estaban escritos directamente
// dentro de MatchPlayers.jsx, y añade el selector de método de pago.
// Lo usan:
//   - MatchPlayers.jsx (lista de Players, pre-partido y estado Played)
//   - MatchPaymentsCard.jsx (post-partido: Ready / Playing)
//
// Este componente NO llama a la API: recibe los handlers por props. Las
// reglas reales (qué método se permite, cobros/reembolsos de wallet) las
// valida SIEMPRE el backend (server/controller/admin.js). Lo que se
// deshabilita aquí es solo para que la UI sea clara.
import { Flex, Select, Switch, Tag, Tooltip, Modal } from "antd";

// Estados donde el backend NO deja cobrar con wallet (mismo criterio que
// WALLET_CHARGE_BLOCKED_STATUSES en server/controller/admin.js).
const WALLET_CHARGE_BLOCKED_STATUSES = ["Played", "Closed", "Cancelled"];

// Estados donde el backend NO deja editar pagos (PAYMENT_LOCKED_STATUSES).
const PAYMENT_LOCKED_STATUSES = ["Closed"];

const formatMethod = (method) =>
  method ? method.charAt(0).toUpperCase() + method.slice(1) : "-";

const PlayerPaymentControls = ({
  player,
  paymentMethods = [],
  matchStatus,
  loading = false,
  onTogglePaid,
  onChangeMethod,
}) => {
  const method = player?.payment?.method;
  const status = player?.payment?.status;
  const isBooker = method === "booker";
  const isWallet = method === "wallet";
  const isLocked = PAYMENT_LOCKED_STATUSES.includes(matchStatus);

  // El booker no paga a nadie: solo se muestra la etiqueta.
  if (isBooker) {
    return <Tag color="blue"><strong>Booker</strong></Tag>;
  }

  const walletBlocked = WALLET_CHARGE_BLOCKED_STATUSES.includes(matchStatus);

  const methodOptions = paymentMethods
    .map((pm) => pm?.type)
    .filter((type) => type && type !== "booker")
    .map((type) => ({
      value: type,
      label:
        type === "wallet" && walletBlocked && !isWallet
          ? "Wallet (not available for this match)"
          : formatMethod(type),
      disabled: type === "wallet" && walletBlocked && !isWallet,
    }));

  // Confirmación previa: los cambios que tocan wallet mueven dinero real.
  const confirmMethodChange = (newMethod) => {
    let content = `Change payment method from ${formatMethod(method)} to ${formatMethod(newMethod)}?`;

    if (isWallet) {
      content += ` The amount paid with wallet will be refunded to the player's wallet and the payment will be marked as unpaid.`;
    } else if (newMethod === "wallet") {
      content += ` The amount will be charged to the player's wallet and the payment will be marked as paid.`;
    }

    Modal.confirm({
      title: "Change payment method",
      content,
      okText: "Change",
      cancelText: "Cancel",
      onOk: () => onChangeMethod?.(player?.user?._id, newMethod),
    });
  };

  return (
    <Flex align="center" gap={8} wrap>
      <Select
        size="small"
        value={method}
        options={methodOptions}
        onChange={confirmMethodChange}
        disabled={loading || isLocked}
        style={{ minWidth: 130 }}
        aria-label="Payment method"
      />

      <Tooltip
        title={
          isWallet
            ? "Wallet payments are settled automatically. Change the payment method to edit it."
            : ""
        }
      >
        <Switch
          checked={status === "paid"}
          checkedChildren="paid"
          unCheckedChildren="unpaid"
          onChange={() => onTogglePaid?.(player?.user?._id)}
          loading={loading}
          disabled={isWallet || isLocked}
        />
      </Tooltip>
    </Flex>
  );
};

export default PlayerPaymentControls;