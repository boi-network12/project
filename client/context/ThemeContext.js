import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

const themes = {
    dark: {
        background: "rgba(0,0,0,0.9)",
        backgroundBlur: "rgba(0,0,0,0.6)",
        text: "#f2f2f2", 
        primaryBtn: "#4c3bcf",
        dimPrimaryBtn: "#8475e2",
        btnTab: "#333333",
        dashBoardColorText: "#f4f4f4",
        clickBackGround: "#333",
        modelBg: "#555",
        dropDownText: "#f2f2f2f2"
    },
    light: {
        background: "#f2f2f2", 
        backgroundBlur: "rgba(255,255,255,0.6)",
        text: "#333",
        primaryBtn: "#4c3bcf",
        dimPrimaryBtn: "#8475e2",
        btnTab: "#f2f2f2",
        dashBoardColorText: "#f4f4f4",
        clickBackGround: "#dddddd",
        modelBg: "#fff",
        dropDownText: "#333333"
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
