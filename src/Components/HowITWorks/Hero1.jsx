import React from "react";
import Mobile from "../../assets/Mobile.jpg";

const Hero1 = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-200 to-yellow-200 pt-24 pb-6">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-6">
          
          {/* Text Section */}
          <div className="px-5 order-2 sm:order-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800">
              <span className="text-black">Effortless </span>
              <span className="text-green-700">Plant Health Identification</span>
            </h1>

            <p className="pb-3 font-semibold text-green-900 text-sm sm:text-base leading-relaxed">
              The all-in-one AI-powered solution for identifying plant diseases, 
              pests, and nutrient deficiencies. Designed for both beginners and experts,
              it makes plant care smarter, simpler, and more effective.
            </p>

            <button className="font-bold bg-green-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-yellow-500 hover:text-green-900 transition duration-300">
              Get Started
            </button>
          </div>

          {/* Image Section */}
          <div className="order-1 sm:order-2">
            <img
              src={Mobile}
              alt="Mobile app preview"
              className="w-full max-w-lg rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero1;
