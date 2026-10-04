// [NUEVO ARCHIVO] src/hooks/useNow.js
// Hook movido SIN CAMBIOS desde RankingSeason.jsx.
import { useEffect, useState } from "react";

// Reloj que se actualiza cada 30 s (para la cuenta atrás)
const useNow = (intervalMs = 30000) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
};

export default useNow;