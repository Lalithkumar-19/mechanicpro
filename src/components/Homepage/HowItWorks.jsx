import React from 'react';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';


const StepCard = ({ step, title, description, icon, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Step Number with orange Ring */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-orange-500 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
          <div className="text-white text-2xl font-bold">{step}</div>
        </div>
        {/* Icon */}
        <div className="absolute -top-2 -right-2 bg-orange-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      step: "1",
      title: "Search & Find Services",
      description: "Enter your location and instantly discover verified mechanics and workshops around you. Filter by ratings, distance, or services you need.",
      icon: <Search className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Book & Schedule",
      description: "Select the service, confirm your car details, and choose your preferred time slot. Transparent pricing, no hidden charges.",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Track & Monitor",
      description: "Once booked, stay updated every step of the way — from confirmation to completion. Get instant notifications and progress updates.",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-10 mt-1 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <img
            src='https://images.pexels.com/photos/4489704/pexels-photo-4489704.jpeg'
            alt='car-repair-bg'
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div> {/* Dark overlay */}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Rest of your component remains the same */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl font-bold text-white mb-6">
            Get Your Car Serviced in{" "}
            <span className="text-orange-400">Just 3 Simple Steps</span>
          </p>
          <p className="text-gray-200 text-lg md:text-xl">
            No more guesswork, no more waiting. Just straightforward car servicing that works around your schedule.
          </p>
        </motion.div>

        {/* Steps Section - Desktop */}
        <div className="hidden lg:block relative">
          {/* Connecting Line */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gray-800">
            <div className="absolute inset-0 bg-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard {...step} index={index} />

                {/* Arrow between steps (except last) */}
                {index < 2 && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20"
                    style={{ left: `${(index + 1) * 33.33}%` }}>
                    <ArrowRight className="w-8 h-8 text-orange-500 bg-black p-1 rounded-full" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* Steps Section - Mobile */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-start space-x-6 group"
            >
              {/* Step Number */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-orange-500 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                  <div className="text-white text-xl font-bold">{step.step}</div>
                </div>
                {/* Icon */}
                <div className="absolute -top-2 -right-2 bg-orange-500 p-1.5 rounded-lg">
                  {React.cloneElement(step.icon, { className: "w-4 h-4 text-white" })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20 max-w-2xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <button
            onClick={() => navigate("/find-mechanics")}
            className="cursor-pointer  group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center space-x-2 cursor-pointer">
              <Calendar className="w-5 h-5" />
              <span>Book Your First Service Now</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;