import React from "react";
import Plantaifrontpage from "../../assets/plantaifrontpage.jpg"; // ✅ Updated image

const Hero = () => {
  return (
    <div className="relative py-14 bg-gradient-to-r from-green-200 to-yellow-200 pt-28">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-6">
          
          {/* 🌿 Text Section */}
          <div className="px-5 order-2 sm:order-1">
            <h1 className="text-5xl font-bold text-green-800">
              PlantCare<span className="text-black">-AI</span>
            </h1>

            <p className="font-bold py-4 text-green-700 text-xl">
              Scan, Upload, Learn – Smarter Plant Care
            </p>

            <p className="pb-4 font-semibold text-green-900 leading-relaxed">
              PlantCare AI helps users monitor and diagnose plant health
              through image inputs. With a focus on user experience and clean
              data visualization, it simplifies the process of identifying
              plant diseases and tracking them in real time.
            </p>

            <button className="font-bold bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 hover:text-green-900 transition duration-300">
              Get Started
            </button>
          </div>

          {/* 🌱 Image Section */}
          <div className="order-1 sm:order-2">
            <img
              src={Plantaifrontpage}
              alt="PlantCare AI Frontpage"
              className="w-full max-w-xl rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
