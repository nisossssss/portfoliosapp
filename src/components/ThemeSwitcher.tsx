import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
    const { currentTheme, availableThemes, setTheme } = useTheme();

    return (
        <div className="theme-switcher">
            <label htmlFor="theme-select">Tema:</label>
            <select
                id="theme-select"
                value={currentTheme.id}
                onChange={(e) => setTheme(e.target.value)}
                className="theme-select"
                style={{
                    backgroundColor: currentTheme.colors.backgroundColor,
                    color: currentTheme.colors.darkTextColor,
                    borderColor: currentTheme.colors.accentColor,
                }}
            >
                {availableThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                        {theme.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
