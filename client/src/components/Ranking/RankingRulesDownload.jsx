// [CAMBIO] client/src/components/Ranking/RankingRulesDownload.jsx
// Botón para descargar el reglamento del ranking (PDF público en Cloudinary).
// [CAMBIO] La URL va escrita aquí (es pública y permanente, no es un secreto):
//   - ya NO depende de REACT_APP_RANKING_RULES_URL ni de la configuración de Vercel
//   - el botón se muestra SIEMPRE (antes se ocultaba si faltaba la variable)
//   - ya NO usa client/public/
// Para publicar un reglamento nuevo: súbelo a Cloudinary y cambia la URL de abajo
// (la parte v1794347425 cambia con cada subida), o sube con el mismo nombre y overwrite.
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

// [NUEVO] Enlace verificado: abre/descarga el PDF por sí solo.
// Los espacios van codificados como %20 (tal cual lo da Cloudinary).
const RULES_URL =
    "https://res.cloudinary.com/rgustv-personal/image/upload/v1794347425/Ranking%20rules/MTC%20Ranking%20Rules.pdf";

const RankingRulesDownload = ({ label = "Download rules (PDF)", block = false }) => {
    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            href={RULES_URL}
            // Pestaña nueva: si el navegador (iPhone, WhatsApp...) abre el PDF en vez de descargarlo,
            // el usuario no sale de la app y puede guardarlo desde el visor.
            target="_blank"
            rel="noopener noreferrer" // la pestaña nueva no accede a window.opener
            aria-label="Download the MTC Ranking rules as a PDF file"
            block={block}
            style={{ minHeight: 44 }} // objetivo táctil de 44 px en móvil
        >
            {label}
        </Button>
    );
};

export default RankingRulesDownload;