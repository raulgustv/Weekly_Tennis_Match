import { useState, useEffect, useCallback, useMemo } from "react";
import { getNotifications, updateSeenNotification } from "../actions/notifications";

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const data = await getNotifications(); // ya viene desestructurado desde la action

        if (!cancelled) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error cargando notificaciones:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const markSeen = useCallback(async (ids) => {
    if (!ids.length) return;

    // actualizacion optimista: se siente instantaneo en el UI
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n._id) ? { ...n, seen: true } : n))
    );

    try {
      await updateSeenNotification(ids);
    } catch (err) {
      console.error("Error marcando como vistas:", err);
      // si falla, opcionalmente podrias revertir el estado optimista aqui
    }
  }, []);

  const tourSteps = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "tour")
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [notifications]
  );

  const tourUnseen = useMemo(() => tourSteps.filter((n) => !n.seen), [tourSteps]);

  const updates = useMemo(() => notifications.filter((n) => n.type === "update"), [notifications]);

  const updatesUnseen = useMemo(() => updates.filter((n) => !n.seen), [updates]);

  // marca como vistas TODAS las updates pendientes de una vez
  const clearAll = useCallback(() => {
    if (!updatesUnseen.length) return;
    markSeen(updatesUnseen.map((n) => n._id));
  }, [updatesUnseen, markSeen]);

  return {
    loading,
    tourSteps,
    tourUnseen,
    updates,
    updatesUnseen,
    markSeen,
    clearAll,
  };
};