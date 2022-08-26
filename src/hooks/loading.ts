import { useState, useCallback, useEffect } from "react";

export const useLoading = (defaultValue = false) => {
  const [loading, setLoading] = useState<boolean>(defaultValue);
  const [cue, setCue] = useState<number[]>([]);

  const wait = useCallback(async <T>(promise: Promise<T>) => {
    const cueId = Date.now();
    setCue((cue) => [...cue, cueId]);
    await promise;
    setCue((cue) => cue.filter((c) => c !== cueId));
  }, []);

  useEffect(() => {
    setLoading(!!cue.length);
  }, [cue]);

  return {
    value: loading,
    wait,
  };
};
