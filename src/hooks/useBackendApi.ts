import { useEffect, useState } from 'react';

interface UseBackendApiOptions {
  url: string;
  enabled?: boolean;
}

interface UseBackendApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  isWakingUp: boolean;
  error: Error | null;
}

export function useBackendApi<T = string>({
  url,
  enabled = true,
}: UseBackendApiOptions): UseBackendApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    let wakingUpTimer: number;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Se la richiesta impiega più di 3 secondi, assumiamo che il server si stia risvegliando
      wakingUpTimer = setTimeout(() => {
        setIsWakingUp(true);
      }, 3000);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          credentials: 'include',
        });

        clearTimeout(wakingUpTimer);
        setIsWakingUp(false);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        let result: T;

        if (contentType?.includes('application/json')) {
          result = await response.json();
        } else {
          result = (await response.text()) as T;
        }

        setData(result);
      } catch (err) {
        clearTimeout(wakingUpTimer);
        setIsWakingUp(false);

        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
      clearTimeout(wakingUpTimer);
    };
  }, [url, enabled]);

  return { data, isLoading, isWakingUp, error };
}
