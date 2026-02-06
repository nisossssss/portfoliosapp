import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiUrl } from '../config/api';
import './ApiStatus.css';

interface ApiStatusResponse {
  status: 'connected' | 'disconnected' | 'testing';
  message: string;
  timestamp: string;
  endpoints: {
    name: string;
    status: 'ok' | 'error' | 'pending';
    message?: string;
  }[];
}

export function ApiStatus() {
  const [status, setStatus] = useState<ApiStatusResponse>({
    status: 'testing',
    message: 'Testing connection...',
    timestamp: new Date().toISOString(),
    endpoints: [
      { name: API_ENDPOINTS.AUTH.ME, status: 'pending' },
      { name: API_ENDPOINTS.BLOGS.LIST, status: 'pending' },
    ],
  });

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    const endpoints = [
      { name: API_ENDPOINTS.AUTH.ME, method: 'GET' },
      { name: API_ENDPOINTS.BLOGS.LIST, method: 'GET' },
    ];

    const results: typeof status.endpoints = [];
    let allOk = true;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(getApiUrl(endpoint.name), {
          method: endpoint.method,
          credentials: 'include',
        });
        
        if (response.ok) {
          results.push({
            name: endpoint.name,
            status: 'ok',
            message: `${response.status} OK`,
          });
        } else {
          results.push({
            name: endpoint.name,
            status: 'error',
            message: `${response.status} ${response.statusText}`,
          });
          allOk = false;
        }
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: 'error',
          message: 'Connection failed',
        });
        allOk = false;
      }
    }

    setStatus({
      status: allOk ? 'connected' : 'disconnected',
      message: allOk
        ? 'Backend collegato e funzionante!'
        : 'Errore: controlla che Spring Boot sia avviato su localhost:8080',
      timestamp: new Date().toISOString(),
      endpoints: results,
    });
  };

  return (
    <div className={`api-status api-status-${status.status}`}>
      <div className="api-status-header">
        <h3>Backend Status</h3>
        <button onClick={testConnections} className="refresh-btn">
          Riprova
        </button>
      </div>
      
      <p className="api-status-message">{status.message}</p>

      <div className="endpoints-list">
        {status.endpoints.map((endpoint) => (
          <div key={endpoint.name} className={`endpoint-item endpoint-${endpoint.status}`}>
            <span className="endpoint-icon">
              {endpoint.status === 'ok' && '✓'}
              {endpoint.status === 'error' && '✕'}
              {endpoint.status === 'pending' && '○'}
            </span>
            <span className="endpoint-name">{endpoint.name}</span>
            {endpoint.message && <span className="endpoint-message">{endpoint.message}</span>}
          </div>
        ))}
      </div>

      <div className="api-status-footer">
        <p className="timestamp">{new Date(status.timestamp).toLocaleTimeString()}</p>
        <pre className="debug-info">{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ApiStatus;
