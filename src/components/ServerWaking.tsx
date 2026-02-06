import { useTheme } from '../contexts/ThemeContext';
import './ServerWaking.css';

interface ServerWakingProps {
  message?: string;
}

function ServerWaking({ message = 'Risveglio del server in corso...' }: ServerWakingProps) {
  const { colors } = useTheme();

  return (
    <div className="server-waking-overlay" style={{ backgroundColor: `${colors.backgroundColor}ee` }}>
      <div className="server-waking-content">
        <div className="spinner" style={{ borderTopColor: colors.accentColor }}></div>
        <p style={{ color: colors.accentColor }}>{message}</p>
        <small>Il server si sta riavviando, potrebbero volerci fino a 60 secondi.</small>
      </div>
    </div>
  );
}

export default ServerWaking;
