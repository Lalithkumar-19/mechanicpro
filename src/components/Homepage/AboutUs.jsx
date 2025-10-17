import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function TextRoll({ children, className }) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.span>
    );
}

const features = [
    {
        icon: <Zap className="w-6 h-6 text-orange-500" />,
        title: "Quick Booking",
        description: "Book services in minutes with our intuitive platform"
    },
    {
        icon: <Shield className="w-6 h-6 text-orange-500" />,
        title: "Trusted Mechanics",
        description: "All our technicians are verified and certified professionals"
    },
    {
        icon: <Users className="w-6 h-6 text-orange-500" />,
        title: "Customer First",
        description: "We prioritize your satisfaction with transparent service"
    }
];

const AboutUs = () => {
    return (
        <div id="about-us" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black">

            {/* Background Video/Image */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                >
                    <source
                        src="https://www.pexels.com/download/video/4488723/"
                        type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black opacity-70"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <h1 className=" text-white text-3xl py-2">
                                About <span className="text-orange-500">MechanicPro</span>
                            </h1>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                <TextRoll className="text-white block">The Smarter Way</TextRoll>
                                <TextRoll className="text-orange-500 block">To Book Your</TextRoll>
                                <TextRoll className="text-white block">Vehicle Service</TextRoll>
                            </h1>

                            <p className="text-xl text-white/90 leading-relaxed">
                                Owning a vehicle comes with joy, convenience, and—of course—the responsibility of
                                regular maintenance. But finding a reliable mechanic or service center can often be
                                time-consuming and stressful.
                            </p>

                            <p className="text-xl text-white/90 leading-relaxed">
                                That's where <span className="text-orange-400 font-semibold">MechanicPro</span> steps in,
                                transforming the way drivers book and manage their vehicle servicing needs.
                            </p>
                        </div>

                        {/* Key Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-semibold text-white">Why Choose MechanicPro?</h3>
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{feature.title}</h4>
                                            <p className="text-white/70 text-sm">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Button
                                onClick={() => {
                                    location.href = "/find-mechanics";
                                }}
                                size="lg"
                                className="bg-orange-500 h-14 cursor-pointer hover:bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                            >
                                Get Started Today
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                onClick={() => {
                                    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
                                }}
                                size="lg"
                                variant="outline"
                                className="border-orange-200 h-14 hover:bg-orange-50 text-black cursor-pointer dark:border-orange-800 dark:hover:bg-orange-950/50 "
                            >
                                Learn More
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/20">
                            <img
                                src="https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="Professional Car Service"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;