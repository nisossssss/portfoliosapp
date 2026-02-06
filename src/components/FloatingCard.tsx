import profileImage from '../assets/images/laura.png';
import { useTheme } from '../contexts/ThemeContext';
import './FloatingCard.css';

interface FloatingCardProps {
    imageSrc?: string;
    imageAlt?: string;
    contactTitle?: string;
    contactText?: string;
}

function FloatingCard({
    imageSrc = profileImage,
    imageAlt = 'Profile',
    contactTitle = 'Contact',
    contactText = 'Madrid - lally@gmail.com \n 3543453450'
}: FloatingCardProps) {
    const { colors } = useTheme();
    const contactLines = contactText.split('\n');

    return (
        <div className="floating-card">
            <div className="accent-background" style={{ backgroundColor: colors.accentColor }}>
                <div className="circle" style={{ backgroundColor: colors.backgroundColor }}></div>
            </div>
            <img src={imageSrc} alt={imageAlt} />
            <div className="info-bar" style={{ backgroundColor: colors.darkTextColor }}>
                <h3 style={{ color: colors.lightTextColor }}>{contactTitle}</h3>
                <p style={{ color: colors.lightTextColor }}>
                    {contactLines.map((line, index) => (
                        <span key={`${line}-${index}`}>
                            {line}
                            {index < contactLines.length - 1 ? <br /> : null}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}

export default FloatingCard;
