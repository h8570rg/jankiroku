import { useState, useCallback } from "react";

export const useLoading = (defaultValue = false) => {
  const [loading, setLoading] = useState<boolean>(defaultValue);

  const wait = useCallback(async <T>(promise: Promise<T>) => {
    setLoading(true);
    const res = await promise;
    setLoading(false);
    return res;
  }, []);

  return {
    value: loading,
    wait,
  };
};
