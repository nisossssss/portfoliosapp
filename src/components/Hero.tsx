import { useTheme } from '../contexts/ThemeContext';
import FloatingCard from './FloatingCard';
import './Hero.css';

function Hero() {
    const { colors } = useTheme();
    
    return (
        <section className="hero-section" id='about-me'>
            <div className="hero-content">
                <h1 style={{color: colors.darkTextColor}}>Ciao,<br />I'm Laura</h1>
                <p style={{color: colors.darkTextColor}}>Italian student based in Madrid. <br />Languages, snowboarding and little stories about life...</p>

                <div className="link-content" style={{backgroundColor: colors.accentColor, color: colors.lightTextColor}}>
                    <a href="https://www.instagram.com/lauraargentieri_/">@lauraargentieri/</a>
                </div>
            </div>
            
            <FloatingCard />
        </section>
    )
}

export default Hero