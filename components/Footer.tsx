import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../website/store";
import { Link } from "react-scroll"; // Import Link from react-scroll
import arabic from "../website/arabic.json";
import english from "../website/english.json";

interface FooterProps {
  className?: string;
  name?: string;
  website?: string;
}

const NestedFooter: React.FC<FooterProps> = ({

  className = '',
  name = 'Bytronix Team',
  website = 'https://bytronix.tech'
}) => {
  const theme = useSelector((state: RootState) => state.theme)
  return (
    <div className={`mt-10 mb-24 text-center ${className}`} style={{zIndex: 99999}}>
      <p className={`text-md ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
        {"Designed & Developed with ♥ By "}
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#39B6BD] font-semibold underline"
        >
          {name}
        </a>
      </p>
    </div>
  );
};

export const FOOTER: React.FC = () => {
  // Get current language from Redux state
  const lang = useSelector((state: RootState) => state.language);

  // Choose language based on current state
  const lan = lang === "arabic" ? arabic : english;
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <div className={` ${theme === "light" ? "bg-gray-200" : "bg-gray-900"}  text-black py-10`} style={{ zIndex: 20 }}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {/* Brand or Logo */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className={`text-3xl font-bold text-[#39B6BD] mb-4`}>
              {lan.footer_brand || "Haibatuk"}</h3>
            <p className={`text-lg  ${theme === "light" ? "text-gray-700" : "text-gray-300"}  mb-4`}>
              {lan.footer_description || "Your health, our priority"}</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-[#39B6BD] hover:text-teal-800">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-[#39B6BD] hover:text-teal-800">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-[#39B6BD] hover:text-teal-800">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#39B6BD] hover:text-teal-800">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold text-[#39B6BD] mb-4">
              {lan.footer_navigation || "Quick Links"}</h4>
            <ul className="space-y-3 text-lg">
              <li><Link to="main" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_main || "Services"}</Link></li>
              <li><Link to="about-us" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_about_us || "About Us"}</Link></li>
              <li><Link to="contact-us" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_contact_us || "Contact Us"}</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold text-[#39B6BD] mb-4">
              {lan.footer_products || "Products"}</h4>
            <ul className="space-y-3 text-lg">
              <li><Link to="product1" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_product_1 || "Product 1"}</Link></li>
              <li><Link to="product2" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_product_2 || "Product 2"}</Link></li>
              <li><Link to="product3" smooth={true} duration={500}
                className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>
                {lan.footer_product_3 || "Product 3"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold text-[#39B6BD] mb-4">
              {lan.footer_contact || "Contact Us"}</h4>
            <ul className="space-y-3 text-lg">
              <li>
                <i className="fas fa-phone-alt text-[#39B6BD] mr-2"></i>
                <span className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>+9647722995020 / +9647811478551</span>
              </li>
              <li>
                <i className="fas fa-envelope text-[#39B6BD] mr-2"></i>
                <span className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>info@haibatuk.com</span>
              </li>
              <li>
                <i className="fas fa-clock text-[#39B6BD] mr-2"></i>
                <span className={` ${theme === "light" ? "text-gray-700" : "text-gray-200"} `}>{lan.footer_hours || "Sat - Sun, 9 AM - 2 PM"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Made by Sajad Kenani */}
        <NestedFooter />


      </div>
    </div>
  );
};
