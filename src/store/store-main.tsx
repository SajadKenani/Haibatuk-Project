import { BrowserRouter, Routes, Route } from 'react-router-dom';
import STORE from './store-products';
import { DETAILS } from './store-details';
import store from '../website/store';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';
import logo from '../../src/website/assests/images/logo.png';

import React from 'react';

interface FooterProps {
  name?: string;
  website?: string;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  name = "Bytronix Team",
  website = "https://bytronix.tech",
  className = ""
}) => {
  return (
    <footer className={` py-3 border-t border-teal-400 ${className}`} style={{zIndex: 999}}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <p className="text-gray-700 text-center">
            Made with <span className="text-red-500">♥</span> by{' '}
            <a 
              href={website}
              className="font-medium text-teal-400 hover:text-teal-800 transition-colors duration-300 
              border-b border-teal-200 hover:border-teal-600"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {name}
            </a>
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {/* Optional Social Icons - Uncomment and add your social media links if needed */}
          {/*           
          <a href="#" className="text-gray-500 hover:text-teal-600 transition-colors duration-300">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export const MAIN = () => {
  const temporaryStorePage = () => {
    const [time, setTime] = useState(1);
    const [reload, setReload] = useState(false);

    useEffect(() => {
      if (time <= 0) {
        setReload(true);
      }
    }, [time]);

    useEffect(() => {
      if (reload) {
        window.location.reload();
      }
    }, [reload]);

    useEffect(() => {
      if (time > 0) {
        const interval = setInterval(() => {
          setTime(prev => prev - 1);
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
      }
    }, [time]); // Only run this effect when `time` changes

    return (
      <div className="loading-screen">
        <div className="circle-loader"></div>
        <img src={logo} alt="Logo" className="loading-logo" />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='' Component={temporaryStorePage} />
          <Route path='/store' Component={STORE} />
          <Route path='/store/details' Component={DETAILS} />
        </Routes>
       

      </BrowserRouter>
    </ Provider>
  )
}