import { useTheme } from '../contexts/ThemeContext';
import FloatingCard from './FloatingCard';
import './Hero.css';

function Hero() {
    const { darkTextColor, accentColor, lightTextColor } = useTheme();
    
    return (
        <section className="hero-section" id='about-me'>
            <div className="hero-content">
                <h1 style={{color: darkTextColor}}>Ciao,<br />I'm Laura</h1>
                <p style={{color: darkTextColor}}>Italian student based in Madrid. <br />Languages, snowboarding and little stories about life...</p>

                <div className="link-content" style={{backgroundColor: accentColor, color: lightTextColor}}>
                    <a href="https://www.instagram.com/lauraargentieri_/">@lauraargentieri/</a>
                </div>
            </div>
            
            <FloatingCard />
        </section>
    )
}

export default Hero