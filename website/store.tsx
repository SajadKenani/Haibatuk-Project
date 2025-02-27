import { createStore } from "redux";
import reducer from "../components/reducers/reduce";

// Create the Redux store
const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
