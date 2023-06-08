import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './common-styles/fonts/simple-line-icons.min.css';
import './common-styles/bootstrap.min.css';
import './common-styles/common-style.css';
import Main from './components/Main';
import Features from './components/Features';
import Pricing from './components/Pricing';
import { store } from './store';
import Auth from './components/auth/Auth';
import Payment from './components/Payment';
import Profile from './components/Profile';
import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:1234/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

ReactDOM.render(
  (
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    </Provider>
  ),
  document.getElementById('root')
);
