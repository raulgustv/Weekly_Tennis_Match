// [NUEVO ARCHIVO] client/src/components/Ranking/RankingRulesDownload.jsx
// Botón para descargar el reglamento del ranking (PDF alojado en Cloudinary).
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const ALLOWED_HOST = "res.cloudinary.com";

// [CAMBIO] Ahora devuelve { url, reason }: si la URL no es válida, "reason" explica por qué
const buildDownloadUrl = (rawUrl) => {
    if (!rawUrl) return { url: null, reason: "REACT_APP_RANKING_RULES_URL is empty or undefined (check client/.env and restart npm start)" };

    try {
        const parsed = new URL(rawUrl);

        if (parsed.protocol !== "https:") return { url: null, reason: `URL must use https (got ${parsed.protocol})` };
        if (parsed.hostname !== ALLOWED_HOST) return { url: null, reason: `Host not allowed: ${parsed.hostname} (expected ${ALLOWED_HOST})` };

        if (parsed.pathname.includes("fl_attachment")) return { url: parsed.toString(), reason: null };

        parsed.pathname = parsed.pathname.replace("/upload/", "/upload/fl_attachment/");
        return { url: parsed.toString(), reason: null };
    } catch {
        return { url: null, reason: "REACT_APP_RANKING_RULES_URL is not a valid URL" };
    }
};

const RankingRulesDownload = ({ label = "Download rules (PDF)", block = false }) => {
    const { url: downloadUrl, reason } = buildDownloadUrl(process.env.REACT_APP_RANKING_RULES_URL);

    if (!downloadUrl) {
        // [NUEVO] Solo en desarrollo: dice en la consola del navegador por qué no se ve el botón
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[RankingRulesDownload] Button hidden: ${reason}`);
        }
        return null;
    }

    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            block={block}
        >
            {label}
        </Button>
    );
};

export default RankingRulesDownload;