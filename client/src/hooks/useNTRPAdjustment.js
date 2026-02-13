import dayjs from "dayjs";
import { useMemo } from "react";

export const useNTRPAdjustment = (adjustmentHistory = []) => {
  return useMemo(() => {
    if (!adjustmentHistory.length) return [];

    const grouped = {};

    adjustmentHistory.forEach((item) => {
      const dateKey = dayjs(item.at).format("YYYY-MM-DD");

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          totalChange: 0,
          previousNTRP: item.previousNTRP,
          currentNTRP: item.currentNTRP,
          lastAt: item.at,
          reasons: []
        };
      }

      grouped[dateKey].totalChange += item.change;

      if (dayjs(item.at).isAfter(grouped[dateKey].lastAt)) {
        grouped[dateKey].currentNTRP = item.currentNTRP;
        grouped[dateKey].lastAt = item.at;
      }

      grouped[dateKey].reasons.push(item.reason);
    });

    return Object.values(grouped).sort(
      (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()
    );
  }, [adjustmentHistory]);
};
