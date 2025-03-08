import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../website/store";
import { setLanguage } from "./actions/action";
import { setTheme } from "./actions/action";
import logo from "../website/assests/images/logo.png";
import arabic from "../website/arabic.json";
import english from "../website/english.json";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FaMoon, FaSun } from 'react-icons/fa'; // Font Awesome icons
import { useNavigate } from "react-router-dom";


export const BAR: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // const lang = useSelector((state: RootState) => state.language);

  const [lan, setSelectedLanguage] = useState<Record<string, string>>(english);
  const [scrolling, setScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useSelector((state: RootState) => state.theme);

  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
    if (theme === "light") {
      document.body.className = "bg-gray-800";
    } else {
      document.body.className = "bg-white";
    }
  };

  const navigation = useNavigate()


  // const changeLanguage = useCallback(() => {
  //   if (lang === "arabic") {
  //     dispatch(setLanguage("english"));
  //     setSelectedLanguage(english);
  //   } else {
  //     dispatch(setLanguage("arabic"));
  //     setSelectedLanguage(arabic);
  //   }
  // }, [lang, dispatch]);

  const changeLanguageToArabic = useCallback(() => {
    dispatch(setLanguage("arabic"));
    setSelectedLanguage(arabic);
    localStorage.setItem("lang", "arabic")
  }, [])

  const changeLanguageToEnglish = useCallback(() => {
    dispatch(setLanguage("english"));
    setSelectedLanguage(english);
    localStorage.setItem("lang", "english")
  }, [])

  // Handle scroll event to change the background color
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, []);

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };


  return (
    <div
      className={`header px-6 lg:px-40 fixed w-full transition-all duration-300 
        ${scrolling ? `${theme === "light" ? "bg-white" : "bg-gray-800"} shadow-md` : "bg-transparent"
        }`}
      style={{ zIndex: 10000, top: 0 }}
    >
    <div className="flex justify-between items-center flex justify-between" 
      style={{ zIndex: 9999, width: "100%" }}>
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 cursor-pointer header-logo" style={{ zIndex: 9999 }}>
          <img src={logo} className="w-14 max-w-full" style={{ zIndex: 9999 }} alt="Logo" />
          <h3
            className="text-lg font-semibold hidden lg:block mt-1"
            style={{ color: "#39B6BD" }}
          >
            Haibatuk
          </h3>
        </div>

        {/* Navigation Menu */}
        <div className="items-center space-x-12 hidden lg:flex">
          <ul className="flex">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === "light" ? "bg-gray-800" : "bg-white"}  shadow-lg h-8 mt-5`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <FaMoon className="text-white" />
              ) : (
                <FaSun className="text-gray-800" />
              )}
            </button>
            <li className="cursor-pointer py-4 mx-4 text-white"
              style={{ width: "180px", height: "10px" }} >
              <FormControl fullWidth>
                <InputLabel style={{
                  fontFamily: "Tajawal", backgroundColor: "white",
                  marginTop: "-8px", borderColor: "white"
                }} id="dropdown-label"></InputLabel>
                <Select
                  labelId="dropdown-label"
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    if (selectedValue === "option1") {
                      changeLanguageToEnglish();
                    } else if (selectedValue === "option2") {
                      changeLanguageToArabic();
                    }
                  }}
                  value={lan === english ? "option1" : "option2"}
                  style={{
                    fontFamily: "Tajawal",
                    height: "40px",
                    color: theme === "dark" ? "white" : "black",
                    borderColor: theme === "dark" ? "white" : "black",
                  }}
                >
                  <MenuItem style={{ fontFamily: "Tajawal" }} value="option1"
                    onClick={changeLanguageToEnglish}>{lan.english_para}</MenuItem>
                  <MenuItem style={{ fontFamily: "Tajawal" }} value="option2"
                    onClick={changeLanguageToArabic}>{lan.arabic_para}</MenuItem>
                </Select>
              </FormControl>
            </li>

            <button onClick={() => {
                navigation("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              >
              <li className={`cursor-pointer hover:bg-gray-800 hover:bg-opacity-30
              py-6 transition-colors duration-300 px-6 
              ${theme === "dark" ? "text-white" : "text-black"}`}>
                {lan.bar_contact_us || "Contact Us"}
              </li>
            </button>
            <button onClick={() => {
                navigation("aboutUs");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              >
              <li className={`cursor-pointer hover:bg-gray-800 hover:bg-opacity-30
              py-6 transition-colors duration-300 px-6 
              ${theme === "dark" ? "text-white" : "text-black"}`}>
                {lan.bar_about_us || "About Us"}
              </li>
            </button>
            <button onClick={() => {
                navigation("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              >
              <li className={`cursor-pointer hover:bg-gray-800 hover:bg-opacity-30
              py-6 transition-colors duration-300 px-6 
              ${theme === "dark" ? "text-white" : "text-black"}`}>
                {lan.bar_main || "Main"}
              </li>
            </button>
          </ul>

          {/* Button */}
          <a
            className="border px-4 py-2 mx-4 rounded text-gray-800 cursor-pointer 
            border-2 transition-all duration-300 transform hover:scale-105
            hover:bg-teal-500 text-teal-500 hover:text-white "
            style={{ borderColor: "#39B6BD" }}
            onClick={() => {
              navigation("store");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}

           
          >
           {lan.btn_show_products}
          </a>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="items-center space-x-12 lg:hidden flex" style={{ zIndex: 9999 }}>
        
          {/* Hamburger Icon */}
          <i
            className="fa fa-bars -mt-2 cursor-pointer"
            style={{ color: "#39B6BD", fontSize: "24px" }}
            onClick={toggleMenu} // Toggle menu visibility on click
          ></i>
          
        </div>
      </div>

      {/* Mobile Navigation - Conditional Rendering */}
      <div
        className={`lg:hidden absolute top-0 left-0 right-0 ${theme === "light" ? "bg-white" : "bg-gray-800"}  
          shadow-md py-20 mobile-menu ${isMenuOpen ? "open" : ""}`}
      >
        
        <ul className="flex flex-col items-center gap-3">
        <button onClick={() => {
            navigation("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          >
            <li className={`cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {lan.bar_main || "Main"}</li>
          </button>
          <button onClick={() => {
            navigation("aboutUs");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          >
            <li className={`cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {lan.bar_about_us || "About Us"}</li>
          </button>
          <button onClick={() => {
            navigation("contact");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          >
            <li className={`cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              {lan.bar_contact_us || "Contact Us"}</li>
          </button>

          <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === "light" ? "bg-gray-800" : "bg-white"}  
              shadow-lg h-8 mt-5`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <FaMoon className="text-white" />
              ) : (
                <FaSun className="text-gray-800" />
              )}
            </button>
        
            <li className="cursor-pointer text-white mb-12"
              style={{ width: "180px", height: "10px" }} >
              <FormControl fullWidth>
                <InputLabel style={{
                  fontFamily: "Tajawal", backgroundColor: "white",
                   borderColor: "white"
                }} id="dropdown-label"></InputLabel>
                <Select
                  labelId="dropdown-label"
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    if (selectedValue === "option1") {
                      changeLanguageToEnglish();
                    } else if (selectedValue === "option2") {
                      changeLanguageToArabic();
                    }
                  }}
                  value={lan === english ? "option1" : "option2"}
                  style={{
                    fontFamily: "Tajawal",
                    height: "40px",
                    color: theme === "dark" ? "white" : "black",
                    borderColor: theme === "dark" ? "white" : "black",
                  }}
                >
                  <MenuItem style={{ fontFamily: "Tajawal" }} value="option1"
                    onClick={changeLanguageToEnglish}>{lan.english_para}</MenuItem>
                  <MenuItem style={{ fontFamily: "Tajawal" }} value="option2"
                    onClick={changeLanguageToArabic}>{lan.arabic_para}</MenuItem>
                </Select>
              </FormControl>
            </li>

          {/* Button */}
          {/* <a
            className="border px-4 py-2 mx-4 rounded text-gray-800 cursor-pointer 
            border-2 transition-all duration-300 transform hover:scale-105
            hover:bg-teal-500 text-teal-500 hover:text-white "
            style={{ borderColor: "#39B6BD" }}
            onClick={() => navigation("departments")}
           
          >
           {lan.btn_show_products}
          </a> */}

          <a
            className="border px-4 py-2 mx-4 rounded text-gray-800 cursor-pointer 
            border-2 transition-all duration-300 transform hover:scale-105
            hover:bg-teal-500 text-teal-500 hover:text-white"
            style={{ borderColor: "#39B6BD" }}
            onClick={() => {
              navigation("store");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
           {lan.btn_show_products}
          </a>

        </ul>
      </div>
    </div>
  );
};
