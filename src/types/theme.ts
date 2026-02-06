export interface ThemeColors {
    accentColor: string;
    backgroundColor: string;
    darkTextColor: string;
    lightTextColor: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
}

export const PREDEFINED_THEMES: Theme[] = [
    {
        id: 'burgundy',
        name: 'Burgundy',
        colors: {
            accentColor: '#6F1110',
            backgroundColor: '#EDEBDD',
            darkTextColor: '#1B1717',
            lightTextColor: '#EDEBDD'
        }
    },
    {
        id: 'forest',
        name: 'Forest',
        colors: {
            accentColor: '#233126',
            backgroundColor: '#D8D0C2',
            darkTextColor: '#1B1717',
            lightTextColor: '#D8D0C2'
        }
    },
    {
        id: 'ocean',
        name: 'Ocean',
        colors: {
            accentColor: '#0a5a7a',
            backgroundColor: '#d9e8f0',
            darkTextColor: '#1B1717',
            lightTextColor: '#d9e8f0'
        }
    },
    {
        id: 'sunset',
        name: 'Sunset',
        colors: {
            accentColor: '#d97441',
            backgroundColor: '#fce4d9',
            darkTextColor: '#2d1b0f',
            lightTextColor: '#fce4d9'
        }
    },
    {
        id: 'midnight',
        name: 'Midnight',
        colors: {
            accentColor: '#465b75',
            backgroundColor: '#0f1419',
            darkTextColor: '#ffffff',
            lightTextColor: '#d1d5db'
        }
    }
];
