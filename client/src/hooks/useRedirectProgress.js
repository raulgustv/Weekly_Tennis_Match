import { useEffect, useState } from "react";

const useRedirectWithProgress = ({ duration = 3000, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  const start = () => {
    setProgress(0);
    setActive(true);
  };

  useEffect(() => {
    if (!active) return;

    const intervalTime = 100;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActive(false);
          onFinish?.();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [active, duration, onFinish]);

  return {
    progress,
    active,
    start,
  };
};

export default useRedirectWithProgress;
