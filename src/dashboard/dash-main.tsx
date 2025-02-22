import { useEffect } from 'react';
import { FaPlus, FaHome, FaBuilding } from 'react-icons/fa';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import { ADD } from './Insertion';
import { BROWSE } from './Browse.tsx';
import { MAIN_DEPT } from './Departments/main';
import { SUB } from './Departments/sub';
import logo from "../assets/logo.png"; // Make sure the path is correct
import LOGIN from './login';
import { DETAILS } from './product-details';
import { NESTEDSUB } from './Departments/n-sub.tsx';


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

export const DASHBOARD = () => {

  useEffect(() => {
    const token = localStorage.getItem("@storage_Key");
    
 
    if (!token){
      // Get username and password from environment variables
      const storedUsername = import.meta.env.VITE_CLIENT_USERNAME;
      const storedPassword = import.meta.env.VITE_CLIENT_PASSWORD;
      
      if (storedUsername && storedPassword) {
        handleLogin(storedUsername, storedPassword); // Attempt login with stored credentials
      } else {
        console.error("Username or password is missing from environment variables");
      }}
    
  }, []);

  return (
    <BrowserRouter>
      {/* If not logged in, redirect to login page */}
      {localStorage.getItem("login") === "true" ? 
           <div className="flex bg-gray-800">
           {/* Desktop Navigation */}
           <nav className="desktop-nav hidden md:flex flex-col items-start w-1/5 p-4 
           bg-gray-800 h-full text-white space-y-6 mt-10" style={{height: "100vh"}}>
             {/* Logo */}
             <div className="w-full flex justify-center">
               <img src={logo} alt="Logo" className="w-32 h-auto mb-6" />
             </div>
             <NavLink to="/admin/add" className="nav-link flex items-center text-left hover:text-blue-400">
               <FaPlus className="mr-2" /> Insert a Product
             </NavLink>
             <NavLink to="/admin" className="nav-link flex items-center text-left hover:text-blue-400">
               <FaHome className="mr-2" /> Products
             </NavLink>
             <NavLink to="/admin/departments" className="nav-link flex items-center text-left hover:text-blue-400">
               <FaBuilding className="mr-2" /> Departments
             </NavLink>
           </nav>
 
           {/* Mobile Navigation */}
           <nav className="mobile-nav flex md:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white justify-around p-4 shadow-md z-10">
             <NavLink to="/admin/add" className="nav-link flex flex-col items-center hover:text-blue-400">
               <FaPlus className="text-2xl" />
             </NavLink>
             <NavLink to="/admin" className="nav-link flex flex-col items-center hover:text-blue-400">
               <FaHome className="text-2xl" />
             </NavLink>
             <NavLink to="/admin/departments" className="nav-link flex flex-col items-center hover:text-blue-400">
               <FaBuilding className="text-2xl" />
             </NavLink>
           </nav>
 
           {/* Main Content */}
           <div className="flex-grow dark:bg-gray-900 text-black bg-black">
             <Routes>
               <Route path="/admin/" element={<BROWSE />} />
               <Route path="/admin/add" element={<ADD />} />
               <Route path="/admin/departments" element={<MAIN_DEPT />} />
               <Route path="/admin/departments/sub" element={<SUB />} />
               <Route path="/admin/departments/sub/nested" element={<NESTEDSUB />} />
               <Route path="/details" element={<DETAILS />} />

             </Routes>
           </div>
         </div>
         :
         <LOGIN />}
   
      
    </BrowserRouter>
  );
};

