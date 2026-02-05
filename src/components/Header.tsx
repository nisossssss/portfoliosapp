import { useEffect, useState } from 'react';
import Symbol1 from '../assets/images/symbol-1.svg?react';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

function Header() {
    const { accentColor, backgroundColor, darkTextColor, lightTextColor } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen((open) => !open);
    const closeMenu = () => setIsMenuOpen(false);

    const [userName, setUserName] = useState<string>('');


    useEffect(() => {
        fetch('https://portfolios-spring-boot-app.onrender.com/api/user/name')
            .then((response) => response.text())
            .then((data) => setUserName(data))
            .catch((error) => console.error('Error fetching user name:', error));
    }, []);
    
    return (
        <header style={{ backgroundColor, color: darkTextColor }}>
            <div className="name-container">
                <Symbol1
                    style={{ fill: accentColor }}
                    className="symbol-1"
                />
                <h1>{userName}</h1>
            </div>
            <button
                type="button"
                className="menu-toggle"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                style={{ color: darkTextColor }}
            >
                Menu
            </button>
            <nav className="header-links">
                <a href="#about-me">About Me</a>
                <a href="#blog">Blog</a>
                <div className="link-container" style={{ backgroundColor: accentColor }}>
                    <a href="#resume" style={{color: lightTextColor}}>My Resume!</a>
                </div>
            </nav>
            <nav
                id="mobile-menu"
                className={`header-links mobile-menu ${isMenuOpen ? 'open' : ''}`}
            >
                <a href="#about-me" onClick={closeMenu}>About Me</a>
                <a href="#blog" onClick={closeMenu}>Blog</a>
                <div className="link-container" style={{ backgroundColor: accentColor }}>
                    <a href="#resume" style={{color: lightTextColor}} onClick={closeMenu}>My Resume!</a>
                </div>
            </nav>
        </header>
    )
}

export default Header