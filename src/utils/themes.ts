import { nativeTheme } from "electron";
import { getSettings, saveSettings } from "../store/settingsStore";

export enum ThemeTypes {
    Carbon = 1,
    Snow = 2,
}
export enum ThemeModeSetting {
    Auto,
    Dark,
    Light,
}
export type ThemeSetting = {
    Mode: ThemeModeSetting;
    LightTheme: ThemeTypes;
    DarkTheme: ThemeTypes;
};

const SERIALIZED_THEME_MODE = {
    [ThemeModeSetting.Auto]: "auto",
    [ThemeModeSetting.Dark]: "dark",
    [ThemeModeSetting.Light]: "light",
} as const satisfies Record<ThemeModeSetting, string>;

export type SerializedTheme = {
    LightTheme?: ThemeTypes;
    DarkTheme?: ThemeTypes;
    mode?: (typeof SERIALIZED_THEME_MODE)[ThemeModeSetting];
};

const DEFAULT_THEME: ThemeSetting = {
    Mode: ThemeModeSetting.Auto,
    LightTheme: ThemeTypes.Snow,
    DarkTheme: ThemeTypes.Carbon,
};

export function getTheme() {
    const settings = getSettings();

    if (!settings.theme) {
        return DEFAULT_THEME;
    }

    const theme = { ...DEFAULT_THEME };

    switch (settings.theme.mode) {
        case "dark":
            theme.Mode = ThemeModeSetting.Dark;
            break;
        case "light":
            theme.Mode = ThemeModeSetting.Light;
            break;
        default:
            break;
    }

    if (settings.theme.LightTheme && settings.theme.LightTheme in ThemeTypes) {
        theme.LightTheme = settings.theme.LightTheme;
    }

    if (settings.theme.DarkTheme && settings.theme.DarkTheme in ThemeTypes) {
        theme.DarkTheme = settings.theme.DarkTheme;
    }

    return theme;
}

export function setTheme(theme: ThemeSetting) {
    if (theme.Mode === ThemeModeSetting.Auto) {
        nativeTheme.themeSource = "system";
    } else {
        nativeTheme.themeSource = SERIALIZED_THEME_MODE[theme.Mode];
    }

    const lightTheme = theme.LightTheme in ThemeTypes ? theme.LightTheme : DEFAULT_THEME.LightTheme;
    const darkTheme = theme.DarkTheme in ThemeTypes ? theme.DarkTheme : DEFAULT_THEME.DarkTheme;

    saveSettings({
        ...getSettings(),
        theme: {
            LightTheme: lightTheme,
            DarkTheme: darkTheme,
            mode: SERIALIZED_THEME_MODE[theme.Mode],
        },
    });
}
