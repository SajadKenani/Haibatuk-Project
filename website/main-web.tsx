import { useEffect, useState } from 'react';
import logo from './assests/images/logo.png';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BAR } from '../components/Header';
import { CONTENT } from './content';
import { FOOTER } from '../components/Footer';
import store from './store';
import ABOUT from "./AboutUs"
import { CONTACT } from './contact';
import { Link } from 'react-router-dom';

import { PhoneCall } from "lucide-react";
import DETAILS from './store-details';
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

export const MAIN_WEB = () => {
  const [loading, setLoading] = useState(true);

  // List of images to preload
  const imagesToLoad = [
    './assests/images/logo.png',
    "./assests/images/main_background.png",
    "./assests/images/girl.png",
    "./assests/images/prize.png",
    "./assests/images/costumers.png",
    "./assests/images/group.png"
  ];

  useEffect(() => {
    const loadImages = () => {
      const imagePromises = imagesToLoad.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      // Wait for all images to load
      Promise.all(imagePromises)
        .then(() => {
          setTimeout(() => {
            setLoading(false);
          }, 3000);

        })
        .catch(() => {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        });
    };

    loadImages();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>

        {loading ? (
          <div className="loading-screen">
            <div className="circle-loader"></div>
            <img src={logo} alt="Logo" className="loading-logo" />
          </div>
        ) : (
          <>
            <BAR />
            <Routes>
              <Route path="/" Component={CONTENT} />
              <Route path="/aboutUs" Component={ABOUT} />
              <Route path="/details" Component={DETAILS} />

              <Route path='/contact' Component={CONTACT} />
              <Route path='/store' Component={temporaryStorePage} />
              {/* Button */}

            </Routes>
            <div
              className="fixed bottom-0 right-0 z-50 flex justify-between lg:justify-end items-center w-full p-4 lg:mr-28"
            >

              <Link to={"/store"}
                className="px-6 py-3 m-6 rounded text-white bg-teal-500 shadow-lg 
              border-2 border-teal-600 cursor-pointer transition-transform 
              duration-300 transform hover:scale-105 hover:bg-teal-600 hover:shadow-xl text-lg flex lg:hidden"
                style={{ zIndex: 8752 }}
              >
                Show Products
              </Link>

              <a
                href="tel:7074"
                className="flex items-center gap-2 px-6 py-3 m-6 rounded text-white shadow-lg 
                border-2 border-teal-600 cursor-pointer transition-transform 
                duration-300 transform hover:scale-105 hover:bg-teal-600 hover:shadow-xl text-lg"
                style={{ zIndex: 8752, backgroundColor: "#39B6BD" }}
              >
                <PhoneCall size={24} />
                7074
              </a>
            </div>


            <FOOTER />
          </>
        )}

      </BrowserRouter>
    </Provider>
  );
};
