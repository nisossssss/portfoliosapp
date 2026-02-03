import { useTheme } from '../contexts/ThemeContext';
import './Resume.css';

 
function Resume() {
    const { accentColor } = useTheme();

    return (
        <section id="resume" className="resume-section" style={{ backgroundColor: accentColor }}>
        </section>
    );
}

export default Resume;
