import { createContext, useContext } from 'react';
import type { ThemeColors } from '../types/theme';

// Create the context with default values
const ThemeContext = createContext<ThemeColors>({
    accentColor: '',
    backgroundColor: '',
    darkTextColor: '',
    lightTextColor: ''
});

// Custom hook to use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};

export default ThemeContext;
