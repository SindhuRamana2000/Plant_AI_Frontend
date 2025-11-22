import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faLeaf,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className="relative py-14 bg-gradient-to-r from-green-200 to-yellow-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 md:gap-x-8 gap-y-6 border-b-2 border-green-400 pb-10">
        
        {/* Column 1: PlantCare AI Info */}
        <div className="flex flex-col items-start space-y-3 ">
          <div className="text-3xl font-bold text-black-800">
            PlantCare-<span className="text-green-800">AI</span>
          </div>

          <p className="text-green-700 text-sm">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-black-800" />
            Stay connected with your plant care queries!
          </p>

          <p className="text-green-700 text-sm">
            <FontAwesomeIcon icon={faLeaf} className="mr-2 text-black-600" />
            Helping together grow a greener and healthier future 🌱
          </p>

          <div className="flex space-x-4 pt-2">
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-2xl text-pink-500 cursor-pointer hover:text-pink-700"
            />
            <FontAwesomeIcon
              icon={faFacebookF}
              className="text-2xl text-blue-600 cursor-pointer hover:text-blue-800"
            />
            <FontAwesomeIcon
              icon={faTwitter}
              className="text-2xl text-blue-400 cursor-pointer hover:text-blue-600"
            />
          </div>
        </div>

        {/* Column 2 and 3: Help Center + Legal (closer together) */}
        <div className="flex flex-col md:flex-row md:space-x-10 space-y-8 md:space-y-0 md:col-span-2 justify-center md:justify-start">
          
          {/* Help Center Section */}
          <div className=" px-20 flex flex-col items-start space-y-2 ">
            <div className="text-xl font-semibold text-green-900">Help Center</div>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              FAQs
            </a>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              How it works
            </a>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              Contact Us
            </a>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col items-start space-y-2">
            <div className="text-xl font-semibold text-green-900">Legal</div>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-green-800 hover:text-yellow-600 transition-colors duration-200">
              Resources
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center pt-5 text-green-900">
        &copy; {new Date().getFullYear()} PlantCare-AI 🌿. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
