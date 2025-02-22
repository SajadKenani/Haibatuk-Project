// reducers/reduce.ts
export interface State {
  language: string;
  theme: string;
}

export interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  language: "english",
  theme: "light",
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
      case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export default reducer;
