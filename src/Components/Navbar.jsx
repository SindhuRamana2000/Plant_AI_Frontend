import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaLeaf, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "How It Works", link: "/how" },
  { id: 3, name: "Scan / Upload", link: "/scan" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-8">
        
        {/* 🌿 Logo */}
        <div className="flex items-center gap-2 text-4xl font-extrabold">
          <FaLeaf className="text-green-700" />
          <span className="text-black">PlantCare</span>
          <span className="text-green-800">AI</span>
        </div>

        {/* 🖥️ Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-end items-center space-x-10 text-2xl font-semibold">
          {navLinks.map(({ id, name, link }) => (
            <NavLink
              key={id}
              to={link}
              className={({ isActive }) =>
                `relative transition duration-300 ${
                  isActive
                    ? "text-green-700 font-bold after:absolute after:left-0 after:bottom-[-6px] after:h-[3px] after:w-full after:bg-green-600 after:rounded-full"
                    : "text-gray-800 hover:text-green-600"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-green-700 text-3xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* 📲 Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center gap-5 py-5 text-xl font-medium">
            {navLinks.map(({ id, name, link }) => (
              <NavLink
                key={id}
                to={link}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `hover:text-green-600 transition ${
                    isActive
                      ? "text-green-700 font-bold underline underline-offset-4"
                      : "text-gray-700"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
