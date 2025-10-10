import React from 'react';
import { CheckCircle, Clock, ShieldCheck, Calendar, Wrench, Headset, IndianRupee } from 'lucide-react';

const WhyUs = () => {
    const features = [
        {
            icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
            title: "Verified & Trusted Mechanics",
            description: "Every mechanic is hand-verified for skill, reliability, and quality. Your car is always in safe hands."
        },
        {
            icon: <Clock className="w-6 h-6 text-orange-500" />,
            title: "Real-Time Tracking",
            description: "Know exactly what's happening with your car. From 'Confirmed' to 'Completed', track your service live."
        },
        {
            icon: <IndianRupee className="w-6 h-6 text-orange-500" />,
            title: "Transparent Pricing",
            description: "No hidden costs. You see upfront prices for every service before booking."
        },
        {
            icon: <Calendar className="w-6 h-6 text-orange-500" />,
            title: "Convenient Scheduling",
            description: "Book instantly or schedule your service at your preferred date and time — it's your choice."
        },
        {
            icon: <Wrench className="w-6 h-6 text-orange-500" />,
            title: "Complete Car Care at One Place",
            description: "From AC repair to engine overhauls, detailing to inspections — everything your car needs is right here."
        },
        {
            icon: <Headset className="w-6 h-6 text-orange-500" />,
            title: "Fast Support & Instant Updates",
            description: "Get real-time notifications and updates for every step. We keep you informed, always."
        }
    ];

    return (
        <section className="pt-10 bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
                    <p className="text-lg sm:text-xl text-orange-400 font-medium mb-6">
                        Because Your Car Deserves the Best Care - Fast, Transparent, and Hassle-Free
                    </p>
                    {/* <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                        We're not just another car service platform — we're your car's digital pit-stop. Our mission is to make car care
                        effortless, trustworthy, and completely transparent. From quick searches to real-time service tracking, we ensure
                        every part of your journey is smooth and stress-free.
                    </p> */}
                </div>

                {/* Mobile Layout - Stack features vertically */}
                <div className="lg:hidden space-y-8 mb-12">
                    {features.map((feature, index) => (
                        <div key={index} className="group text-center">
                            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg transition-all duration-300 hover:bg-gray-800/50">
                                <div className="bg-gray-800 p-3 rounded-lg group-hover:bg-orange-500 transition-colors duration-300">
                                    {React.cloneElement(feature.icon, { className: "w-8 h-8 text-orange-500 group-hover:text-white" })}
                                </div>
                                <div className="max-w-sm">
                                    <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Layout - Original side-by-side design */}
                <div className="hidden lg:block relative max-w-7xl mx-auto">
                    {/* Left Side Features */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 space-y-10">
                        {[features[0], features[2], features[4]].map((feature, index) => (
                            <div key={index} className="text-left group">
                                <div className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-gray-800/50">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-orange-500 transition-colors duration-300">
                                        {React.cloneElement(feature.icon, { className: "w-6 h-6 text-orange-500 group-hover:text-white" })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed text-justify">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center Car Image with Dotted Circle */}
                    <div className="flex justify-center items-center py-12 px-4">
                        <div className="relative w-full max-w-md">
                            <img src='https://cdn.pixabay.com/photo/2023/10/23/17/03/audi-8336484_1280.jpg' alt='car-streering' className='rounded-lg' />
                            {/* <video 
                                src='https://cdn.pixabay.com/video/2021/09/13/88481-606110665_large.mp4' 
                                loop 
                                autoPlay 
                                muted 
                                className='w-full h-auto object-contain relative z-10 transform hover:scale-105 transition-transform duration-500 rounded-full'
                            /> */}
                        </div>
                    </div>

                    {/* Right Side Features */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 space-y-10">
                        {[features[1], features[3], features[5]].map((feature, index) => (
                            <div key={index} className="text-right group">
                                <div className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 hover:bg-gray-800/50 flex-row-reverse">
                                    <div className="bg-gray-800 p-2 rounded-lg ml-4 group-hover:bg-orange-500 transition-colors duration-300">
                                        {React.cloneElement(feature.icon, { className: "w-6 h-6 text-orange-500 group-hover:text-white" })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-1 text-end">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed text-justify">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="max-w-3xl mx-auto text-center pt-8 lg:pt-2 mt-12 lg:mt-28 border-t border-gray-800 mb-5">
                    <p className="text-lg sm:text-xl text-orange-400 font-medium italic">
                        Simple. Reliable. Transparent. That's how car servicing should be — and that's exactly what we deliver.
                    </p>
                </div>
            </div>
            <div className='w-full mt-4 h-1 bg-gradient-to-r from-white via-orange-300 to-black' />
        </section>
    );
};

export default WhyUs;