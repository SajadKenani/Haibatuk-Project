import { BrowserRouter, Routes, Route } from 'react-router-dom';
import STORE from './store-products';
import { DETAILS } from './store-details';
import store from '../website/store';
import { Provider } from 'react-redux';

export const MAIN = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
    <Route path='/store' Component={STORE} />
    <Route path='/store/details' Component={DETAILS} />
    </Routes>

    </BrowserRouter>
    </ Provider>
  )
}