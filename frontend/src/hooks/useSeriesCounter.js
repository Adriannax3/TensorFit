import { useEffect, useRef, useState } from "react";

export default function useSeriesCounter(strategy, keypoints) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("idle");
  const stateRef = useRef(strategy?.init ? strategy.init() : {});

  useEffect(() => {
    if (!keypoints || !strategy.update) return;

    const out = strategy.update({
      keypoints,
      count,
      phase,
      state: stateRef.current,
    });
    if (!out) return;
    if (typeof out.count === "number" && out.count !== count)
      setCount(out.count);
    if (out.phase && out.phase !== phase) setPhase(out.phase);
    if (out.state) stateRef.current = out.state;
  }, [keypoints, strategy, count, phase]);

  const reset = () => {
    setCount(0);
    setPhase("idle");
    stateRef.current = strategy?.init ? strategy.init() : {};
  };

  return { count, phase, reset };
}
