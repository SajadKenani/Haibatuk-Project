interface ProductData {
    id: number;
    name: string;
    description: string;
    department: string;
    image: string;
    price: string;
}

// actions/action.ts
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_THEME = 'SET_THEME';
export const SET_DATA = 'SET_DATA'
export const SET_FILTERED_DATA = 'SET_FILTERED_DATA'
export const SET_DROPDOWN = 'SET_DROPDOWN'

export interface SetLanguageAction {
    type: typeof SET_LANGUAGE;
    payload: string;
}

export interface SetThemeAction {
    type: typeof SET_THEME;
    payload: string;
}

export interface SetDataAction {
    type: typeof SET_DATA;
    payload: ProductData[];
}

export interface SetFilteredDataAction {
  type: typeof SET_FILTERED_DATA;
  payload: ProductData[];
}

export interface SetIsMobileSidebarOpen {
  type: typeof SET_DROPDOWN;
  payload: boolean;
}

export type AppActions = SetLanguageAction | SetThemeAction | SetDataAction;

export const setLanguage = (language: string): SetLanguageAction => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setTheme = (theme: string): SetThemeAction => ({
  type: SET_THEME,
  payload: theme,
});

export const setData = (data: ProductData[]): SetDataAction => ({
  type: SET_DATA,
  payload: data,
});

export const setFilteredData = (data: ProductData[]): SetFilteredDataAction => ({
  type: SET_FILTERED_DATA,
  payload: data,
});

export const setIsMobileSidebarOpen = (dropdown: boolean): SetIsMobileSidebarOpen => ({
 type: SET_DROPDOWN,
 payload: dropdown,
})