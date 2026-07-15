import { useState, useEffect } from 'react';

export function useTheme() {
    
    // 1. Resolve initial theme state safely
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('app-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        
        // Fallback: Check Windows native system color setting
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // 2. Synchronize DOM and localStorage whenever theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('app-theme', 'dark');
        } else {
        root.classList.remove('dark');
        localStorage.setItem('app-theme', 'light');
        }
    }, [theme]);

    // 3. Optional: Listen to native Windows OS theme toggles in real-time
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleOSChange = (e: MediaQueryListEvent) => {
        // Only auto-sync if the user hasn't hard-pinned a choice in this session
        if (!localStorage.getItem('app-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
        };

        mediaQuery.addEventListener('change', handleOSChange);
        return () => mediaQuery.removeEventListener('change', handleOSChange);
    }, []);

    // Helper actions for your components
    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    const isDark = theme === 'dark';

    return { theme, setTheme, toggleTheme, isDark };
}