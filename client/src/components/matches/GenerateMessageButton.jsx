// 🔵 NUEVO (archivo completo): botón "Generate message" para la vista del match
// (/match/details/:id). Antes este botón vivía en la tabla de matches
// (MatchesTable.jsx); ahora está dentro del propio match, igual que
// "Generate matches". Es SOLO para admin.
//
// Reutiliza tal cual el modal que ya existía (components/modals/WhatsappMessage.jsx),
// así que el mensaje tiene exactamente la misma información que antes.
// No se llama a ningún endpoint: el mensaje se arma en el cliente con los datos
// del match que ya carga MatchPlayers (getMatch trae los mismos populate que
// getAllMatches, que era de donde salía el match en la tabla).
import { useState } from "react";
import { Button } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import colors from "../../themes/colors";
import WhatsappMessage from "../modals/WhatsappMessage";

const GenerateMessageButton = ({ match }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // 🔵 SEGURIDAD: solo admin (no booker). Se comprueba aquí dentro además de en
  // el padre, para que el botón no pueda renderizarse por error para otro rol.
  // Nota: esto es solo UI. El mensaje no contiene datos sensibles (son los mismos
  // datos públicos del match) y no hay endpoint nuevo que proteger.
  if (user?.role !== "admin") return null;

  // 🔵 Misma condición que tenía la tabla: solo partidos Open o Full.
  const canGenerateMessage = match?.status === "Open" || match?.status === "Full";
  if (!canGenerateMessage) return null;

  return (
    <>
      {/* 🔵 CAMBIO: el texto pasa a "Generate Whatsapp message" y el botón ahora se
          adapta al contenido. Antes se veía pequeño y el texto se salía porque
          antd fija height=32px y white-space:nowrap en los botones.
            - height:'auto' + minHeight:40 → crece si el texto ocupa 2 líneas
              y es más fácil de tocar en móvil.
            - whiteSpace:'normal' → permite el salto de línea dentro del botón.
            - padding vertical + lineHeight → el texto en 2 líneas no queda pegado. */}
      <Button
        icon={<WhatsAppOutlined />}
        onClick={() => setOpen(true)}
        block
        style={{
          background: colors.blue,
          height: "auto",
          minHeight: 40,
          whiteSpace: "normal",
          lineHeight: 1.3,
          padding: "6px 12px",
          color: "#FFFFFF"
        }}
      >
        Generate Whatsapp message
      </Button>

      {/* Mismo modal de siempre. Recibe el match completo, así que el texto
          se regenera solo si el match cambia (p. ej. tras quitar un jugador). */}
      <WhatsappMessage open={open} match={match} setOpenMessage={setOpen} />
    </>
  );
};

export default GenerateMessageButton;