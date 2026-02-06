import { useTheme } from '../contexts/ThemeContext';
import './Resume.css';

 
function Resume() {
    const { colors } = useTheme();

    return (
        <section id="resume" className="resume-section" style={{ backgroundColor: colors.accentColor }}>
        </section>
    );
}

export default Resume;
