import { useSelector } from "react-redux";
import { RootState } from "./store";

import background from "./assests/images/main_background.png";
import girl from "./assests/images/girl.png";
import prize from "./assests/images/prize.png";
import costumers from "./assests/images/costumers.png";
import group from "./assests/images/group.png";
import about from "./assests/images/about.png";
import prize_logo from "./assests/images/prize_logo.png";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

import floor from "./assests/images/floor.png";
import house from "./assests/images/house.png";
import pc from "./assests/images/pc.png";
import win from "./assests/images/win.png"
import { Swiper, SwiperSlide } from "swiper/react";
import AOS from 'aos';
import 'aos/dist/aos.css'
import corner from "./assests/images/corner.png"
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import contact from "./assests/images/contact.png"
import arabic from "./arabic.json";
import english from "./english.json";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import { Navigation } from "lucide-react";
import { GET } from "../components/Requests";

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';


interface ProductData {
  id: number;
  name_en: string;
  description_en: string;
  type_en: string;
  brand_en: string;
  name_ar: string;
  description_ar: string;
  type_ar: string;
  brand_ar: string;
  image: string;
  price: string;
  size: string;
  department: string;
  subDepartment: string;
}

const handleLogin = async (username: string, password: string) => {
  const API_URL = import.meta.env.VITE_SERVER_URL;
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), // Send username and password as JSON
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("@storage_Key", data.token); // Store the received token in localStorage
    } else {
      const errorData = await response.json();
      console.error("Login failed: " + errorData.message);
    }
  } catch (error) {
    console.log("Error during login: ");
  }
};


export const CONTENT = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const lang = useSelector((state: RootState) => state.language);

  const navigate = useNavigate()

  // Choose language based on current state
  const lan = lang === "arabic" ? arabic : english;

  // Dynamically set the text direction based on the language
  const textDirection = lang === "arabic" ? "end" : "start";
  const theme = useSelector((state: RootState) => state.theme);

  const cardData = [
    {
      imgSrc: house,
      title: lang === "arabic" ? "منتجات المعطرات " : "Fragrance Products",
      description:
        lang === "arabic"
          ? "منتجات معطرة لإضفاء روائح منعشة وجذابة لمنزلك."
          : "Fragrance products to bring fresh and appealing scents to your home.",
    },
    {
      imgSrc: pc,
      title: lang === "arabic" ? "منتجات العطور " : "Perfume Products",
      description:
        lang === "arabic"
          ? "مجموعة متنوعة من العطور المميزة التي تناسب كل الأذواق."
          : "A variety of unique perfumes to suit all tastes.",
    },

    {
      imgSrc: win,
      title: lang === "arabic" ? " منتجات ورقية " : "Paper Products",
      description:
        lang === "arabic"
          ? "منتجات ورقية عالية الجودة لكل احتياجاتك اليومية."
          : "High-quality paper products for all your daily needs.",
    },

    {
      imgSrc: floor,
      title: lang === "arabic" ? " منتجات تنظيف " : "Cleaning Products",
      description:
        lang === "arabic"
          ? "منتجات التنظيف السريعة والسهلة التي تجعل حياتك أفضل."
          : "Fast and easy cleaning products that make your life better.",
    },

  ];

  const fetchProducts = async () => {
    try {
      const data = await GET("api/product-en")
      setData(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("@storage_Key");

    if (!token) {
      // Get username and password from environment variables
      const storedUsername = import.meta.env.VITE_CLIENT_USERNAME;
      const storedPassword = import.meta.env.VITE_CLIENT_PASSWORD;

      if (storedUsername && storedPassword) {
        handleLogin(storedUsername, storedPassword); // Attempt login with stored credentials
      } else {
        console.error("Username or password is missing from environment variables");
      }
    }

  }, []);



  useEffect(() => {
    fetchProducts()
  }, [])

  // Decode image function
  const decodeImage = (image: string): string => {
    try {
      return decodeURIComponent(image);
    } catch {
      return image;
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    // Simulate a data fetching process (e.g., after fetching product data)
    if (data.length > 0) {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  }, [data]);

  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };
  return (
    <>

      {/* --------------------------------  Main Section -------------------------------- */}
      <div className={`w-full flex justify-center ${theme === "light" ? "bg-white" : "bg-gray-800"}`} id="main">
        <div
          className={`glowing-lights ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "80%",
            height: "100vh",
            position: "relative",
            overflow: "hidden",
            marginBottom: "-140px"
          }}
        >

          {/* Main Content */}
          <div className="absolute inset-0 flex justify-between items-center text-white -mt-20">
            {lang === "arabic" ?
              <>
                <img
                  src={girl}
                  style={{ width: "500px", zIndex: 1 }}
                  className="mt-20 hidden lg:block fadeInLeft"
                  alt="Girl"
                />

                <div
                  className="content text-center lg:w-3/6 w-11/12 fadeInUp"
                  style={{ textAlign: textDirection, zIndex: 2 }}
                >
                  <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                    {lan.main_title_upper}
                  </p>
                  <h1 className="text-4xl font-bold" style={{ color: "#39B6BD" }}>
                    {lan.main_title_company_name}
                  </h1>
                  <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-4xl font-bold`}>
                    {lan.main_title_lower}
                  </h1>
                  <p className={`${theme === "dark" ? "text-white" : "text-black"} mt-4`}>
                    {lan.main_title_description}
                  </p>

                  <div className="space-x-2 mt-4">
                    <button
                      onClick={() => navigate("aboutUs")}
                      className="border px-4 py-2 rounded text-gray-800 cursor-pointer 
                      border-2 transition-all hover:bg-gray-200"
                      style={{ borderColor: "#39B6BD", color: "#39B6BD" }}
                    >
                      {lan.learn_more_button}
                    </button>

                    <button
                      className="border px-4 py-2 rounded text-gray-800 cursor-pointer 
                      border-2 transition-all hover:bg-gray-200"
                      style={{
                        borderColor: "#39B6BD",
                        color: "white",
                        backgroundColor: "#39B6BD",
                      }}
                    >
                      {lan.contact_us_button}
                    </button>
                  </div>
                </div>
              </>
              :
              <>
                <div
                  className="content text-center lg:w-3/6 w-11/12 fadeInUp"
                  style={{ textAlign: textDirection, zIndex: 2 }}
                >
                  <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                    {lan.main_title_upper}
                  </p>
                  <h1 className="text-4xl font-bold" style={{ color: "#39B6BD" }}>
                    {lan.main_title_company_name}
                  </h1>
                  <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-4xl font-bold`}>
                    {lan.main_title_lower}
                  </h1>
                  <p className={`${theme === "dark" ? "text-white" : "text-black"} mt-4`}>
                    {lan.main_title_description}
                  </p>

                  <div className="space-x-2 mt-4">
                    <Link to="contact-us" smooth={true} duration={0}
                      className="border px-4 py-2 rounded text-gray-800 cursor-pointer 
                      border-2 transition-all hover:bg-gray-200"
                      style={{
                        borderColor: "#39B6BD",
                        color: "white",
                        backgroundColor: "#39B6BD",
                      }}
                    >
                      {lan.contact_us_button}
                    </Link>

                    <button
                      onClick={() => navigate("aboutUs")}
                      className="border px-4 py-2 rounded text-gray-800 cursor-pointer 
                      border-2 transition-all hover:bg-gray-200"
                      style={{ borderColor: "#39B6BD", color: "#39B6BD" }}
                    >
                      {lan.learn_more_button}
                    </button>


                  </div>
                </div>

                <img
                  src={girl}
                  style={{ width: "500px", zIndex: 1 }}
                  className="mt-20 hidden lg:block fadeInLeft"
                  alt="Girl"
                />
              </>
            }

          </div>
        </div>
      </div>

      {/* --------------------------------  Bar Section -------------------------------- */}


      <div className="flex justify-center " style={{ zIndex: 10 }}>
        <div
          className="lg:flex justify-center items-center space-y-12 lg:space-y-4 lg:space-x-12 lg:flex-row"
          style={{
            width: "80%",
            backgroundColor: "#39B6BD",
            borderRadius: "100px",
            zIndex: 10,
            padding: "43px 0 43px 0",
          }}
        >
          {/* First Section */}
          {lang === "arabic" ? (
            <div className="flex items-center justify-center space-x-4 mt-4 fadeInLeft">
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "right", fontSize: "30px" }}
                >
                  +<CountUp start={0} end={567} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "right" }}>
                  عميل سعيد
                </p>
              </div>
              <img
                src={costumers}
                alt="Customers"
                className="w-14 h-12 object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 mt-4 fadeInLeft">
              <img
                src={costumers}
                alt="Customers"
                className="w-14 h-12 object-cover"
              />
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  +<CountUp start={0} end={567} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "left" }}>
                  Happy Customers
                </p>
              </div>
            </div>
          )}

          {/* Vertical Line (Hidden on Mobile) */}
          <div
            style={{
              borderLeft: "2px solid white",
              height: "100%",
              margin: "0 20px 0 60px",
            }}
            className="hidden lg:block"
          ></div>

          {/* Second Section */}
          {lang === "arabic" ? (
            <div className="flex items-center justify-center space-x-4 fadeInUp">
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "right", fontSize: "30px" }}
                >
                  <CountUp start={0} end={26} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "right" }}>
                  أعضاء الفريق
                </p>
              </div>
              <img
                src={group}
                alt="Team Members"
                className="w-14 h-12 object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 fadeInUp">
              <img
                src={group}
                alt="Team Members"
                className="w-14 h-12 object-cover"
              />
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  <CountUp start={0} end={26} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "left" }}>
                  Team Members
                </p>
              </div>
            </div>
          )}

          {/* Vertical Line (Hidden on Mobile) */}
          <div
            style={{
              borderLeft: "2px solid white",
              height: "100%",
              margin: "0 20px 0 60px",
            }}
            className="hidden lg:block"
          ></div>

          {/* Third Section */}
          {lang === "arabic" ? (
            <div className="flex items-center justify-center space-x-4 fadeInRight">
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "right", fontSize: "30px" }}
                >
                  <CountUp start={0} end={26} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "right" }}>
                  الجوائز المكتسبة
                </p>
              </div>
              <img
                src={prize}
                alt="Prizes"
                className="w-14 h-12 object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 fadeInRight">
              <img
                src={prize}
                alt="Prizes"
                className="w-14 h-12 object-cover"
              />
              <div style={{ width: "120px" }}>
                <p
                  className="text-lg text-white"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  <CountUp start={0} end={26} duration={5} />
                </p>
                <p className="text-sm text-white" style={{ textAlign: "left" }}>
                  Awards Won
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------  About Us Section -------------------------------- */}

      <div
        className="flex flex-col md:flex-row justify-center items-center gap-10 mt-44 p-4"
        id="about-us"
        data-aos="fade-up"
      >
        {/* Text Content */}
        <div
          className="max-w-lg"
          style={{ textAlign: textDirection }}
          data-aos="fade-right"
        >
          <p style={{ textAlign: textDirection, color: '#39B6BD' }}>
            {lan.bar_about_us}
          </p>
          <p
            className={`font-bold text-xl mb-2  ${theme === "dark" ? "text-white" : "text-black"}`}
            style={{ textAlign: textDirection }}
            data-aos="fade-left"
          >
            {lan.award_winning}
          </p>
          <p
            className={`mb-4 leading-relaxed mb-10 ${theme === "dark" ? "text-white" : "text-black"}`}
            style={{ textAlign: textDirection }}
            data-aos="fade-up"
          >
            {lan.estableshemnt}
          </p>

          {lang === 'arabic' ? (
            <div
              className="flex items-right justify-end gap-2 mb-4"
              style={{ textAlign: textDirection }}
              data-aos="fade-left"
            >
              <img src={prize_logo} alt="Prize Logo" className="w-6 h-6" />
              <p className={theme === "dark" ? "text-white" : "text-black"}>شركة حائزة على جوائز</p>
            </div>
          ) : (
            <div
              className="flex items-right justify-start gap-2 mb-4"
              style={{ textAlign: textDirection }}
              data-aos="fade-right"
            >
              <p className={theme === "dark" ? "text-white" : "text-black"}>Award-Winning Company</p>
              <img
                src={prize_logo}
                style={{ textAlign: textDirection }}
                alt="Prize Logo"
                className="w-6 h-6"
              />
            </div>
          )}

          <p
            className={`mb-6 leading-relaxed -mt-2 ${theme === "dark" ? "text-white" : "text-black"}`}
            style={{ textAlign: textDirection }}
            data-aos="fade-up"
          >
            {lan.company_offers}
          </p>
          <button
            onClick={() => navigate("aboutUs")}
            className="border px-4 py-2 rounded text-gray-800 cursor-pointer 
                      border-2 transition-all hover:bg-gray-200"
            style={{ borderColor: "#39B6BD", color: "#39B6BD" }}
          >
            {lan.learn_more_button}
          </button>
        </div>

        {/* Image */}
        <img
          src={about}
          alt="About Hebtec"
          className="w-full max-w-md rounded"
          style={{ width: '100%' }}
          data-aos="fade-up"
        />
      </div>

      {/* --------------------------------  Offer Section -------------------------------- */}

      <div>
        <h1 className={`text-center pt-64 text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
          {lan.what_we_offer}
        </h1>
        <div className="flex justify-center flex-wrap gap-6">
          {cardData.map((card, index) => (
            index === 1 ? (
              <div
                key={index}
                className="info-card text-center special-card transform transition-transform duration-500 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: "#2EC2C8", borderRadius: "12px", padding: "1rem" }}
                data-aos="zoom-in"
              >
                <div className={`circle ${theme === "dark" ? "bg-gray-800" : "bg-white"} flex items-center justify-center  rounded-full w-24 h-24 mx-auto mb-4`}>
                  <img src={card.imgSrc} alt="Special Window" />
                </div>
                <h1 className={"text-white text-lg"}>{card.title}</h1>
                <p className="text-white text-sm">{card.description}</p>
              </div>
            ) : (
              <div
                key={index}
                className="info-card text-center transform transition-all duration-500 
                hover:scale-105 hover:shadow-lg "
                style={{ borderRadius: "12px", padding: "1rem", border: "1px solid #ddd" }}
                data-aos="zoom-in"
              >
                <div className={`circle ${theme === "dark" ? "bg-gray-800" : "bg-white"} flex items-center justify-center rounded-full w-24 h-24 mx-auto mb-4`}>
                  <img src={card.imgSrc} alt="Window" />
                </div>
                <h1 className="text-lg" style={{ color: "#2EC2C8" }}>{card.title}</h1>
                <p className={`text-sm ${theme === "dark" ? "text-white" : "text-back"}`}>{card.description}</p>
              </div>
            )
          ))}
        </div>
      </div>

     

      {/* --------------------------------  Store Section -------------------------------- */}

      <div style={{ width: "100%", margin: "0 auto", marginTop: "50px", marginBottom: "100px" }}>
      {isLoading ? (
        // Loading spinner or animation
        <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '450px' }}>
          <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #39B6BD', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
        </div>
      ) : (
        <Swiper
         
          loop={true}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 2, spaceBetween: 0 },
            1024: { slidesPerView: 5, spaceBetween: 0 },
          }}
        >
          {data.map((product) => (
            <SwiperSlide key={product.id}>
              <div
                className="item-container relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 mt-20"
                style={{ width: "280px", height: "450px", margin: "0 auto", marginBottom: "60px" }}
                data-aos="fade-up"
              >
                
                <div className="image-container relative w-full">
                  <img
                    src={`data:image/png;base64,${decodeImage(product.image)}`}
                    alt="Product"
                    className="h-64 duration-500 transform hover:scale-110"
                    style={{ width: "100%", objectFit: "cover", height: "300px" }}
                    data-aos="zoom-in"
                  />
                
                  <img
                    src={corner}
                    alt="Corner Design"
                    className="absolute w-16 h-12"
                    style={{ left: 0, bottom: 0, marginBottom: "50px" }}
                    data-aos="fade-up"
                  />
                  <div className="badge absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {lang === "arabic" ? "جديد" : "New"}
                  </div>
                </div>

                <div
                  className="content-container p-6 pt-6 flex flex-col justify-between bg-white"
                  style={{ borderRadius: "0 50px 0 0 ", zIndex: 321, marginTop: "-62px", width: "100%" }}
                  data-aos="fade-up"
                >
                  <h2 className="font-semibold text-lg text-gray-800 truncate" style={{ textAlign: textDirection }}>
                    {lang === "arabic" ? product.name_ar : product.name_en}
                  </h2>
                  <h3 className="text-sm text-gray-600 truncate mb-2" style={{ textAlign: textDirection }}>
                    {lang === "arabic" ? product.brand_ar : product.brand_en}
                  </h3>
                  <p
                    className="text-xs text-gray-500 leading-5"
                    style={{ textAlign: textDirection, textDecoration: "ltr" }}
                  >
                    {lang === "arabic"
                      ? product.description_ar.split(" ").length > 12
                        ? product.description_ar.split(" ").slice(0, 12).join(" ") + "...إلخ"
                        : product.description_ar
                      : product.description_en.split(" ").length > 12
                      ? product.description_en.split(" ").slice(0, 12).join(" ") + "..."
                      : product.description_en}
                  </p>

                  <div
                    className="flex items-center mt-4"
                    style={lang === "arabic" ? { justifyContent: "end" } : { justifyContent: "start" }}
                  >
                    <button
                      className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-300 bg-teal-500 hover:bg-teal-600 shadow-md transform transition-all duration-500 hover:scale-105"
                      style={{ backgroundColor: "#39B6BD" }}
                      data-aos="fade-up"
                      onClick={() => {localStorage.setItem("productId", JSON.stringify(product.id)); navigate("./details")}}
                      
                    >
                      {lan.view_details}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>

      {/* --------------------------------  Contact Us Section -------------------------------- */}

      <div className="flex justify-center mt-16 mb-32 relative">
        {/* Main Contact Section */}
        <div
          className={`font-sans text-center ${theme === "light" ? "text-gray-800" : "text-white"
            } p-8 shadow-xl rounded-lg w-full lg:w-2/3 bg-${theme === "light" ? "white" : "gray-800"}`}
          id="contact-us"
        >
          {/* Contact Section Header */}
          <div className="text-left mb-8 mr-0 lg:mr-16">
            <h2
              className="text-teal-600 text-3xl font-bold"
              style={{ textAlign: textDirection }}
            >
              {lan.contact_us_button}
            </h2>
            <p
              className="text-lg mt-3"
              style={{ textAlign: textDirection }}
            >
              {lan.contact_us_description}
            </p>
          </div>

          {/* Contact Details and Illustration */}
          <div className={`flex flex-col lg:flex-row ${lan === arabic && "lg:flex-row-reverse"
            } justify-between gap-8`}>
            {/* Contact Details */}
            <div className="w-full lg:w-1/2 mt-10 ">
              <ul className="list-none space-y-4">
                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                  <FaMapMarkerAlt className="text-teal-600 text-2xl " />
                  <span>{lang === "arabic" ? "العراق، بغداد" : "Iraq, Baghdad"}</span>
                </li>
                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                  <FaPhone className="text-teal-600 text-2xl" />
                  <div className="space-y-2">
                    <a href="tel:+9647722995020" >
                      +9647722995020
                    </a>
                    <> / </>
                    <a href="tel:+9647811478551" >
                      +9647811478551
                    </a>
                  </div>

                </li>
                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                  <FaEnvelope className="text-teal-600 text-2xl" />
                  <span>info@haibatuk.com</span>
                </li>
              </ul>
            </div>

            {/* Illustration */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src={contact}
                alt="Contact Illustration"
                className="w-3/4 rounded-lg "
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div
          className="absolute lg:relative flex flex-col bg-teal-500 items-center justify-center 
    lg:-ml-14 top-0 lg:top-auto hidden lg:flex p-4 rounded-r-lg"
        >
          <FaFacebookF
            className={`${theme === "light" && "text-white"} text-3xl cursor-pointer hover:text-teal-700 transition duration-200 mb-4`}
          />
          <FaTwitter
            className={`${theme === "light" && "text-white"} text-3xl cursor-pointer hover:text-teal-700 transition duration-200 mb-4`}
          />
          <FaLinkedinIn
            className={`${theme === "light" && "text-white"} text-3xl cursor-pointer hover:text-teal-700 transition duration-200 mb-4`}
          />
        </div>

      </div>


    </>
  );
};
