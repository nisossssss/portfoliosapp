import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeColors } from '../types/theme';
import { PREDEFINED_THEMES } from '../types/theme';

interface ThemeContextType {
    colors: ThemeColors;
    currentTheme: Theme;
    availableThemes: Theme[];
    setTheme: (themeId: string) => void;
    setCustomTheme: (colors: ThemeColors) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
    userId?: number | null;
}

export const ThemeProvider = ({ children, userId }: ThemeProviderProps) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(PREDEFINED_THEMES[0]);
    const [isLoading, setIsLoading] = useState(true);

    const updateCSSVariables = (colors: ThemeColors) => {
        const root = document.documentElement;
        root.style.setProperty('--accent-color', colors.accentColor);
        root.style.setProperty('--background-color', colors.backgroundColor);
        root.style.setProperty('--dark-text-color', colors.darkTextColor);
        root.style.setProperty('--light-text-color', colors.lightTextColor);
    };

    // Update CSS variables whenever theme changes
    useEffect(() => {
        updateCSSVariables(currentTheme.colors);
    }, [currentTheme]);

    // Load theme from localStorage or preferences
    useEffect(() => {
        const loadTheme = async () => {
            try {
                // Try to load from localStorage first
                const savedThemeId = localStorage.getItem('preferredThemeId');
                if (savedThemeId) {
                    const theme = PREDEFINED_THEMES.find(t => t.id === savedThemeId);
                    if (theme) {
                        setCurrentTheme(theme);
                        setIsLoading(false);
                        return;
                    }
                }

                // If user is authenticated, try to load from backend
                if (userId) {
                    try {
                        const response = await fetch(`/api/users/${userId}/theme-preference`, {
                            credentials: 'include',
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.themeId) {
                                const theme = PREDEFINED_THEMES.find(t => t.id === data.themeId);
                                if (theme) {
                                    setCurrentTheme(theme);
                                    localStorage.setItem('preferredThemeId', theme.id);
                                    setIsLoading(false);
                                    return;
                                }
                            }
                        }
                    } catch (error) {
                        console.log('Could not load theme from backend, using localStorage');
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error loading theme:', error);
                setIsLoading(false);
            }
        };

        loadTheme();
    }, [userId]);

    const setTheme = async (themeId: string) => {
        const theme = PREDEFINED_THEMES.find(t => t.id === themeId);
        if (theme) {
            setCurrentTheme(theme);
            localStorage.setItem('preferredThemeId', themeId);

            // Save to backend if user is authenticated
            if (userId) {
                try {
                    await fetch(`/api/users/${userId}/theme-preference`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ themeId }),
                    });
                } catch (error) {
                    console.error('Error saving theme preference:', error);
                }
            }
        }
    };

    const setCustomTheme = (colors: ThemeColors) => {
        const customTheme: Theme = {
            id: 'custom',
            name: 'Custom',
            colors,
        };
        setCurrentTheme(customTheme);
        localStorage.setItem('customTheme', JSON.stringify(colors));

        // Save custom theme to backend if user is authenticated
        if (userId) {
            try {
                fetch(`/api/users/${userId}/theme-preference`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    credentials: 'include',
                    },
                    body: JSON.stringify({ themeId: 'custom', customColors: colors }),
                });
            } catch (error) {
                console.error('Error saving custom theme:', error);
            }
        }
    };

    if (isLoading) {
        return null;
    }

    const value: ThemeContextType = {
        colors: currentTheme.colors,
        currentTheme,
        availableThemes: PREDEFINED_THEMES,
        setTheme,
        setCustomTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
