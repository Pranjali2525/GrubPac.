"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * Generic data fetching hook.
 * fetchFn: async function returning data
 * deps: dependency array to re-fetch
 */
export function useData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Polling hook – refetches every `interval` ms.
 */
export function usePolling(fetchFn, interval = 30000, deps = []) {
  const result = useData(fetchFn, deps);

  useEffect(() => {
    const timer = setInterval(result.refetch, interval);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  return result;
}
