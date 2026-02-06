import { useState } from 'react';
import Symbol1 from '../assets/images/symbol-1.svg?react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  currentPage: 'home' | 'dashboard' | 'login';
  onPageChange: (page: 'home' | 'dashboard' | 'login') => void;
}

function Header({ currentPage, onPageChange }: HeaderProps) {
    const { colors } = useTheme();
    const { logout, user, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen((open) => !open);
    const closeMenu = () => setIsMenuOpen(false);

    const displayName = user?.email || 'Portfolio App';
    
    const handleLogout = () => {
        logout();
        onPageChange('home');
        closeMenu();
    };

    const handleNavigation = (page: 'home' | 'dashboard' | 'login') => {
        onPageChange(page);
        closeMenu();
    };
    
    return (
        <>
            <header style={{ backgroundColor: colors.backgroundColor, color: colors.darkTextColor }}>
                <div className="name-container">
                    <Symbol1
                        style={{ fill: colors.accentColor }}
                        className="symbol-1"
                    />
                    <button
                        className="brand-button"
                        onClick={() => handleNavigation('home')}
                        style={{ color: colors.darkTextColor }}
                    >
                        <h1>{displayName}</h1>
                    </button>
            </div>
            <button
                type="button"
                className="menu-toggle"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                style={{ color: colors.darkTextColor }}
            >
                Menu
            </button>
            <nav className="header-links">
                <button
                    className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigation('home')}
                    style={{ color: colors.darkTextColor }}
                >
                    Home
                </button>
                {isAuthenticated && (
                    <button
                        className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavigation('dashboard')}
                        style={{ color: colors.darkTextColor }}
                    >
                        Dashboard
                    </button>
                )}
                {!isAuthenticated && (
                    <button
                        className="nav-button"
                        onClick={() => handleNavigation('login')}
                        style={{ color: colors.darkTextColor }}
                    >
                        Accedi
                    </button>
                )}
                <ThemeSwitcher />
                {isAuthenticated && (
                    <button 
                        className="logout-button"
                        onClick={handleLogout}
                        style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}
                    >
                        Logout
                    </button>
                )}
            </nav>
            <nav
                id="mobile-menu"
                className={`header-links mobile-menu ${isMenuOpen ? 'open' : ''}`}
            >
                <button
                    className={`nav-button mobile ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavigation('home')}
                    style={{ color: colors.darkTextColor }}
                >
                    Home
                </button>
                {isAuthenticated && (
                    <button
                        className={`nav-button mobile ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavigation('dashboard')}
                        style={{ color: colors.darkTextColor }}
                    >
                        Dashboard
                    </button>
                )}
                {!isAuthenticated && (
                    <button
                        className="nav-button mobile"
                        onClick={() => handleNavigation('login')}
                        style={{ color: colors.darkTextColor }}
                    >
                        Accedi
                    </button>
                )}
                <ThemeSwitcher />
                {isAuthenticated && (
                    <button 
                        className="logout-button logout-button-mobile"
                        onClick={handleLogout}
                        style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}
                    >
                        Logout
                    </button>
                )}
            </nav>
        </header>
        </>
    )
}

export default Header