import dayjs from "dayjs";
import {
  useMemo
} from "react";


// 🆕 CHANGE (tags NTRP): categoría de cada ajuste según el `reason` que guarda el backend.
// - 'Ranking-match'                           → partido de ranking (controller/ranking.js)
// - 'Match-average-weighted' / 'Social-vote'  → votos de partidas de dobles (skillVote.js / jobs/adjustNTRP.js)
// - 'Admin-adjustment'                        → ajuste manual del admin (controller/admin.js)
const getAdjustmentCategory = (reason) => {
  if (reason === "Ranking-match") return "ranking";
  if (reason === "Match-average-weighted" || reason === "Social-vote") return "doubles";
  if (reason === "Admin-adjustment") return "admin";
  return "other";
};
// ⬆️ FIN CHANGE

export const useNTRPAdjustment = (adjustmentHistory = []) => {
  return useMemo(() => {
    if (!adjustmentHistory.length) return [];

    const grouped = {};

    adjustmentHistory.forEach((item) => {
      const dateKey = dayjs(item.at).format("YYYY-MM-DD");

      // 🆕 CHANGE (tags NTRP): una línea por día + tipo + partido, para que el
      // tag de cada línea sea exacto (antes todo el día se sumaba en una sola).
      // Admin y entradas antiguas sin partido → se agrupan por día y tipo.
      const category = getAdjustmentCategory(item.reason);
      const matchRef = item.rankingMatch || item.match || "";
      const groupKey = `${dateKey}-${category}-${matchRef}`;
      // ⬆️ FIN CHANGE

      if (!grouped[groupKey]) { // CHANGE: antes grouped[dateKey]
        grouped[groupKey] = { // CHANGE: antes grouped[dateKey]
          date: dateKey,
          totalChange: 0,
          previousNTRP: item.previousNTRP,
          currentNTRP: item.currentNTRP,
          lastAt: item.at,
          reasons: [],
          category // 🆕 CHANGE: 'ranking' | 'doubles' | 'admin' | 'other' → tag en NTRPHistory
        };
      }

      grouped[groupKey].totalChange += item.change; // CHANGE: antes grouped[dateKey]

      if (dayjs(item.at).isAfter(grouped[groupKey].lastAt)) { // CHANGE: antes grouped[dateKey]
        grouped[groupKey].currentNTRP = item.currentNTRP;
        grouped[groupKey].lastAt = item.at;
      }

      grouped[groupKey].reasons.push(item.reason); // CHANGE: antes grouped[dateKey]
    });

    // CHANGE: orden por hora exacta (puede haber varias líneas el mismo día). Lo más reciente arriba.
    return Object.values(grouped).sort(
      (a, b) => dayjs(b.lastAt).valueOf() - dayjs(a.lastAt).valueOf()
    );


  }, [adjustmentHistory]);
};