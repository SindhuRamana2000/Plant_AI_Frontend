import React from 'react';

// ✅ Updated Imports for each step
import PlantSelfie from "../../assets/Plantsselfie.png";
import SmallPlant from "../../assets/smallplant.png";
import Brainpic from "../../assets/Brainpic.jpg";
import Robohands from "../../assets/Robohands.jpg"; 

// Reusable component for each step in the "How It Works" section
const StepCard = ({ number, title, description, imageUrl, altText, reverse }) => (
  <div 
    className={`flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-xl shadow-md space-y-6 md:space-y-0 md:space-x-8
                    ${reverse ? 'md:flex-row-reverse' : ''}`}
  >
    {/* Text Content */}
    <div className="md:w-1/2 text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start mb-4">
        <span className="text-4xl font-extrabold text-green-700 mr-3">
          {number}.
        </span>
        <h3 className="text-2xl font-bold text-gray-800">
          {title}
        </h3>
      </div>
      <p className="text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>

    {/* Image/Illustration */}
    <div className="md:w-1/2 flex justify-center">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="max-w-full h-auto object-contain rounded-lg shadow-sm"
        style={{ maxHeight: '250px' }}
      />
    </div>
  </div>
);

const HowItWorksSection = () => {
  // ✅ Each step with its unique image
  const steps = [
    {
      number: 1,
      title: "Capture or Upload your plant",
      description: "Effertlessly capture your waste item using your smartphone camera or by uploading an existing image.Our intuitive interface interface ensures & smooth and quick input process.ready for identification.",
      imageUrl: PlantSelfie,
      altText: "A person taking a selfie with a plant."
    },
    {
      number: 2,
      title: "Upload to PlantCare AI",
      description: "Easily upload your photo to our platform. You can either drag-and-drop or select a picture directly from your device. Our system is designed for quick and hassle-free uploads.",
      imageUrl: SmallPlant,
      altText: "Small plant being uploaded digitally."
    },
    {
      number: 3,
      title: "AI Analysis in Progress",
      description: "Once captured our advanced AI algorithm instantly process the data.it cross references with a vast database to accuratley identifies the plant type from common plant to complex materials.",
      imageUrl: Brainpic,
      altText: "Illustration of a brain with circuit patterns."
    },
    {
      number: 4,
      title: "Receive Detailed Results",
      description: "AI gives immediate, easy-to-understand results. Our system clearly displays the plant type along with complete and similar instructions.",
      imageUrl: Robohands,
      altText: "Illustration of robotic hands analyzing data."
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Section Header: Using Accent Underline Design */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 border-b-4 border-green-600 inline-block pb-1">
          How PlantCare AI Works
        </h2>
      </div>

      {/* Steps Container */}
      <div className="max-w-5xl mx-auto space-y-12">
        {steps.map((step, index) => (
          <StepCard 
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
            imageUrl={step.imageUrl}
            altText={step.altText}
            reverse={index % 2 !== 0} 
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-black-700 mb-6">
          Ready to identify your plant?
          </h3>
      </div>
    </section>
  );
};

export default HowItWorksSection;