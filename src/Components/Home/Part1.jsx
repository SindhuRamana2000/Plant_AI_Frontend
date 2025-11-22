import React from 'react';

// Import your images correctly
import Cropdesis from "../../assets/Cropdesis.png";
import Selfie from "../../assets/selfie.jpeg";
import PlantProgress from "../../assets/plantprogress.jpg";

// Define the data for the three feature cards
const features = [
  {
    title: "Accurate AI Diagnostics",
    description: "Leverage advanced artificial intelligence to accurately identify plant diseases and pests with high confidence from a simple photo.",
    imageUrl: Cropdesis, // ✅ First image
    altText: "Crop disease detection AI system."
  },
  {
    title: "Personalized Care Guidance",
    description: "Receive tailored, expert-backed care recommendations and solutions to help your specific plants thrive and recover.",
    imageUrl: Selfie, // ✅ Second image
    altText: "Person taking a selfie with a plant."
  },
  {
    title: "Effortless Progress Tracking",
    description: "Monitor your plant's health over time with intuitive tracking features, ensuring continuous growth and wellbeing.",
    imageUrl: PlantProgress, // ✅ Third image
    altText: "Progress tracking of plant growth."
  },
];

// Reusable component for an individual feature card
const FeatureCard = ({ title, description, imageUrl, altText }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 p-4">
    <div className="relative overflow-hidden rounded-xl h-48 mb-4">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="object-cover w-full h-full"
      />
    </div>
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl inline-block border-b-4 border-green-600 pb-1">
        Why PlantCare-AI Makes Gardening Easier
</h2>

      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.imageUrl}
            altText={feature.altText}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
