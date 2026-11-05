import { useState, useEffect, useCallback } from "react";
import { ApiError } from "@/lib/api/types";

interface UseApiResult<T, Args extends unknown[]> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (...args: Args) => Promise<T>;
}

export function useApi<T, Args extends unknown[]>(
  apiFunction: (...args: Args) => Promise<T>,
  immediate = true,
  ...initialArgs: Args
): UseApiResult<T, Args> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction],
  );

  const serializedArgs = JSON.stringify(initialArgs);

  useEffect(() => {
    let isMounted = true;

    const fetchAsyncData = async () => {
      try {
        const argsArray = JSON.parse(serializedArgs) as Args;
        await execute(...argsArray);
      } catch {
        setError("Failed to fetch data");
      }
    };

    if (immediate && isMounted) {
      fetchAsyncData();
    }

    return () => {
      isMounted = false;
    };
  }, [immediate, execute, serializedArgs]);

  return { data, error, loading, execute };
}
