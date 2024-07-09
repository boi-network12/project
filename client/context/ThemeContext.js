import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

const themes = {
    dark: {
        background: "#rgba(0,0,0,0.9)",
        text: "#f2f2f2", 
        primaryBtn: "#4c3bcf",
    },
    light: {
        background: "#f2f2ff", 
        text: "#333",
        primaryBtn: "#4c3bcf"
    },
};

const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState(themes[colorScheme]);

    useEffect(() => {
        setTheme(themes[colorScheme]);
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export {
    ThemeContext,
    ThemeProvider
};
