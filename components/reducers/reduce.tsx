interface ProductData {
  id: number;
  name: string;
  description: string;
  department: string;
  sub_department: string;
  nested_department: string;
  image: string;
  price: string;
}

// reducers/reduce.ts
export interface State {
  language: string;
  theme: string;
  data: ProductData[];
  filteredData: ProductData[];
  dropdown: boolean;
}

export interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  language: "english",
  theme: "light",
  data: [],
  filteredData: [],
  dropdown: false,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_DATA":
      return {...state, data: action.payload}
    case "SET_FILTERED_DATA":
      return {...state, filteredData: action.payload}
      case "SET_DROPDOWN":
        return {...state, dropdown: action.payload}
    default:
      return state;
  }
};

export default reducer;
