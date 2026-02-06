import { useEffect, useState } from 'react';
import { API_CONFIG } from '../config/api';

interface ServerWakeStatus {
  isWaking: boolean;
  isReady: boolean;
  error: Error | null;
}

/**
 * Hook per gestire il risveglio del server (cold start su Render)
 * Effettua una chiamata di health check all'avvio per "svegliare" il server
 */
export function useServerWake(): ServerWakeStatus {
  const [isWaking, setIsWaking] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let wakingTimer: number;
    const controller = new AbortController();

    const wakeServer = async () => {
      // Se la richiesta impiega più di 3 secondi, mostra il loading
      wakingTimer = setTimeout(() => {
        setIsWaking(true);
      }, 3000);

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`,
          {
            signal: controller.signal,
            method: 'GET',
          }
        );

        clearTimeout(wakingTimer);

        if (response.ok) {
          setIsReady(true);
          setIsWaking(false);
        } else {
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (err) {
        clearTimeout(wakingTimer);
        
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const error = err instanceof Error ? err : new Error('Failed to wake server');
        setError(error);
        setIsWaking(false);
        console.error('Error waking server:', error);
      }
    };

    wakeServer();

    return () => {
      controller.abort();
      clearTimeout(wakingTimer);
    };
  }, []);

  return { isWaking, isReady, error };
}
