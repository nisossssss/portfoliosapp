import { useTheme } from '../contexts/ThemeContext';
import './FloatingCard.css';

function FloatingCard() {
    const { darkTextColor, accentColor, lightTextColor, backgroundColor } = useTheme();

    return (
        <div className="floating-card">
            <div className="accent-background" style={{ backgroundColor: accentColor }}>
                <div className="circle" style={{ backgroundColor: backgroundColor }}></div>
            </div>
            <img src="src/assets/images/profile.png" alt="Laura Argentieri" />
            <div className="info-bar" style={{ backgroundColor: darkTextColor }}>
                <h3 style={{ color: lightTextColor }}>Contact</h3>
                <p style={{ color: lightTextColor }}>
                    Madrid - lally@gmail.com <br/> 3543453450
                </p>
            </div>
        </div>
    );
}

export default FloatingCard;
