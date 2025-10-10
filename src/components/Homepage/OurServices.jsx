import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Wrench, Settings, Droplets, Palette, Sparkles, Zap, 
  Cog, Shield, FileCheck, Car, RotateCcw, ArrowRight 
} from 'lucide-react';

const ServiceCard = ({ category, services, icon, index, isExpanded, onToggle }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between group"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
            {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
              {category}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {services.length} services available
            </p>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ArrowRight className="w-5 h-5 text-orange-400" />
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-2 border-t border-gray-800">
          <div className="grid gap-3">
            {services.map((service, serviceIndex) => (
              <div key={serviceIndex} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-200">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-medium">{service.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OurServices = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const serviceCategories = [
    {
      category: "AC Services",
      icon: <Droplets className="w-6 h-6" />,
      services: [
        { name: "AC Cleaning & Recharging", description: "Air conditioning system cleaning and refrigerant recharge." },
        { name: "AC Parts Replacement", description: "Air conditioning component replacement and repair." }
      ]
    },
    {
      category: "Denting & Painting",
      icon: <Palette className="w-6 h-6" />,
      services: [
        { name: "Boot Painting", description: "Trunk/boot painting and refinishing." },
        { name: "Front Bumper Denting & Painting", description: "Front bumper dent repair and painting." },
        { name: "Full Body Painting", description: "Complete vehicle body painting." },
        { name: "Damage Paintings", description: "Body damage repair and painting." },
        { name: "Bonnet Painting", description: "Hood painting and refinishing." },
        { name: "Alloys Painting", description: "Alloy wheel painting and refinishing." },
        { name: "Rear Bumper Denting & Painting", description: "Rear bumper dent repair and painting." }
      ]
    },
    {
      category: "Detailing & Accessories",
      icon: <Sparkles className="w-6 h-6" />,
      services: [
        { name: "Full Body Wash + Deep Interior Cleaning", description: "Complete exterior wash and interior detailing." },
        { name: "PPF Installation / Replacement", description: "Paint protection film installation and replacement." },
        { name: "Ceramic Coatings", description: "Ceramic coating application for paint protection." },
        { name: "Rubbing / Polishing", description: "Paint rubbing and polishing services." }
      ]
    },
    {
      category: "Electrical Repairs",
      icon: <Zap className="w-6 h-6" />,
      services: [
        { name: "Battery Charging / Replacement", description: "Battery testing, charging, and replacement services." },
        { name: "Dynamo Repairs", description: "Alternator and dynamo repair services." },
        { name: "Wiper Motors Repairs", description: "Windshield wiper motor repair and replacement." },
        { name: "Headlights Repair / Replacement", description: "Headlight assembly repair and replacement." },
        { name: "Electrical & Electronic Fault Detection and Diagnostics", description: "Comprehensive electrical system diagnostics." }
      ]
    },
    {
      category: "Engine Repairs",
      icon: <Cog className="w-6 h-6" />,
      services: [
        { name: "Carbon Cleaning (Manual)", description: "Manual carbon deposit cleaning from engine components." },
        { name: "Turbo Repairs", description: "Turbocharger repair and replacement services." },
        { name: "Engine Full Bore", description: "Complete engine overhaul and bore reconstruction." },
        { name: "Head Work", description: "Cylinder head repairs and reconditioning." },
        { name: "Clutch Service", description: "Clutch replacement and adjustment services." },
        { name: "Diesel Works (Injectors / Fuel Pumps)", description: "Diesel injection system repair and fuel pump services." },
        { name: "DEF Urea Tank Cleaning", description: "Diesel exhaust fluid system cleaning and maintenance." },
        { name: "Engine Scanning (Check Light)", description: "Diagnostic scanning for engine warning lights." }
      ]
    },
    {
      category: "General Service",
      icon: <Settings className="w-6 h-6" />,
      services: [
        { name: "Luxury Package", description: "Premium maintenance with detailed care and luxury vehicle specialization." },
        { name: "Premium Package", description: "Comprehensive maintenance package with additional inspections and services." },
        { name: "Standard Package", description: "Basic maintenance package including oil change, filter replacement, and basic checks." }
      ]
    },
    {
      category: "Inspection",
      icon: <FileCheck className="w-6 h-6" />,
      services: [
        { name: "Engine Inspection", description: "Detailed engine condition inspection." },
        { name: "Full Vehicle Inspection & Recommendations", description: "Complete vehicle inspection with recommendations." },
        { name: "Pre-owned Car Inspection Assistance", description: "Used car inspection and evaluation." },
        { name: "Road Trip Inspection", description: "Pre-travel vehicle inspection and preparation." },
        { name: "Electrical Inspection", description: "Comprehensive electrical system inspection." }
      ]
    },
    {
      category: "Insurance Services",
      icon: <Shield className="w-6 h-6" />,
      services: [
        { name: "Insurance Services", description: "Vehicle insurance processing and assistance." }
      ]
    },
    {
      category: "Pollution Certificate",
      icon: <RotateCcw className="w-6 h-6" />,
      services: [
        { name: "Pollution Certificate Issuance", description: "Pollution under control certificate issuance." }
      ]
    },
    {
      category: "RTO Works",
      icon: <FileCheck className="w-6 h-6" />,
      services: [
        { name: "RTO Works", description: "Regional Transport Office documentation and services." }
      ]
    },
    {
      category: "Tyres & Wheel Services",
      icon: <Car className="w-6 h-6" />,
      services: [
        { name: "Disc / Brake Pads Replacement / Cleaning", description: "Brake disc and pad replacement and cleaning." },
        { name: "Tyres Replacement", description: "Tire replacement and installation." },
        { name: "Wheel Alignment", description: "Wheel alignment and geometry correction." },
        { name: "Wheel Balancing", description: "Wheel balancing for smooth driving." }
      ]
    }
  ];

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <section id="services" className="py-20  bg-black text-white relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.pixabay.com/photo/2020/05/08/08/49/wash-5144822_1280.jpg"
          alt="Car Service"
          className="w-full h-full object-cover opacity-30"
        />
        {/* <div className="absolute inset-0 bg-black/10"></div> */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comprehensive Car{" "}
            <span className="text-orange-400">Services</span>
          </h2>
          <p className="text-xl text-orange-300 font-medium mb-4">
            Professional Care for Every Part of Your Vehicle
          </p>
          <p className="text-gray-400 text-lg">
            From routine maintenance to complex repairs, we've got you covered with our extensive range of automotive services. 
            Trust our certified technicians to keep your vehicle running smoothly.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {serviceCategories.map((category, index) => (
              <ServiceCard
                key={index}
                {...category}
                index={index}
                isExpanded={expandedCategory === index}
                onToggle={() => toggleCategory(index)}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Need Professional Car Service?
          </h3>
          <button className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Wrench className="w-5 h-5" />
              <span>Find Mechanic & Book Service Now</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default OurServices;