// 🔵 NUEVO (archivo completo): botón para compartir el partido.
// Comparte el enlace a /match/details/:id. Funciona en cualquier estado del
// partido. En móvil usa el menú nativo de compartir (navigator.share); si el
// navegador no lo soporta (la mayoría de escritorio), copia el enlace al
// portapapeles. Quien abra el enlace sin sesión iniciada pasa por el login
// igual que con cualquier otra ruta protegida.
import { Button } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ShareMatchButton = ({ match }) => {
  const handleShare = async () => {
    if (!match?._id) return;

    const url = `${window.location.origin}/match/details/${match._id}`;
    const text = `🎾 ${match?.location?.name || "Tennis match"} · ${dayjs(match?.date).format("ddd DD MMM")} · ${match?.startTime} - ${match?.endTime}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Tennis match", text, url });
        return;
      }

      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("Match link copied to clipboard");
    } catch (error) {
      // El usuario cerró el menú de compartir: no es un error.
      if (error?.name === "AbortError") return;
      toast.error("Could not share the match link");
    }
  };

  return (
    <Button icon={<ShareAltOutlined />} onClick={handleShare} block>
      Share
    </Button>
  );
};

export default ShareMatchButton;