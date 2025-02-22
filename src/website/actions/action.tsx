// actions/action.ts

export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_THEME = 'SET_THEME';

// Define action type
interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  payload: string;
}

interface SetThemeAction {
  type: typeof SET_THEME;
  payload: string;
}

// Action creator with typing
export const setLanguage = (language: string): SetLanguageAction => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setTheme = (Theme: string): SetThemeAction => ({
  type: SET_THEME,
  payload: Theme,
});